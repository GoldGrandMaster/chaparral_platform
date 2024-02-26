package com.cha.service;

import com.cha.config.aws.AwsProperties;
import com.cha.classes.AWSS3Object;
import com.cha.classes.FileResponse;
import com.cha.classes.UploadStatus;
import com.cha.utils.FileUtils;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;
import software.amazon.awssdk.core.BytesWrapper;
import software.amazon.awssdk.core.async.AsyncRequestBody;
import software.amazon.awssdk.core.async.AsyncResponseTransformer;
import software.amazon.awssdk.crt.checksums.CRC32;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.model.*;

import java.nio.ByteBuffer;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;


@RequiredArgsConstructor
@Slf4j
@Service
public class AWSS3FileStorageServiceImpl implements AWSS3FileStorageService {
    private final S3AsyncClient s3AsyncClient;
    private final AwsProperties s3ConfigProperties;

    /**
     * {@inheritDoc}
     */
    @Override
    public Flux<AWSS3Object> getObjects() {
        System.out.println("Listing objects in S3 bucket: " + s3ConfigProperties.getS3BucketName());
        return Flux.from(s3AsyncClient.listObjectsV2Paginator(ListObjectsV2Request.builder()
                .bucket(s3ConfigProperties.getS3BucketName())
                .build()))
            .flatMap(response -> Flux.fromIterable(response.contents()))
            .map(s3Object -> new AWSS3Object(s3Object.key(), s3Object.lastModified(), s3Object.eTag(), s3Object.size()));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Mono<Void> deleteObject(@NotNull String objectKey) {
        System.out.println("Delete Object with key: " + objectKey);
        return Mono.just(DeleteObjectRequest.builder().bucket(s3ConfigProperties.getS3BucketName()).key(objectKey).build())
            .map(s3AsyncClient::deleteObject)
            .flatMap(Mono::fromFuture)
            .then();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Mono<byte[]> getByteObject(@NotNull String key) {
        System.out.println("Fetching object as byte array from S3 bucket: " + s3ConfigProperties.getS3BucketName() + " key: " + key);
        return Mono.just(GetObjectRequest.builder().bucket(s3ConfigProperties.getS3BucketName()).key(key).build())
            .map(it -> s3AsyncClient.getObject(it, AsyncResponseTransformer.toBytes()))
            .flatMap(Mono::fromFuture)
            .map(BytesWrapper::asByteArray);
    }

    public static String calculateBase64EncodedCRC32Checksum(ByteBuffer data) {
        CRC32 crc32 = new CRC32();
        crc32.update(data);
        long checksumValue = crc32.getValue();
        // Convert the long checksum to a byte array
        byte[] bytesChecksum = new byte[4];
        bytesChecksum[0] = (byte) ((checksumValue >> 24) & 0xFF);
        bytesChecksum[1] = (byte) ((checksumValue >> 16) & 0xFF);
        bytesChecksum[2] = (byte) ((checksumValue >> 8) & 0xFF);
        bytesChecksum[3] = (byte) (checksumValue & 0xFF);

        // Base64-encode the byte array
        return Base64.getEncoder().encodeToString(bytesChecksum);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Mono<FileResponse> uploadObject(FilePart filePart, String project_id) {

        String filename = filePart.filename();
        String upload_key = project_id + "/" + filename;
        Map<String, String> metadata = Map.of("filename", filename);
        // get media type
        MediaType mediaType = ObjectUtils.defaultIfNull(filePart.headers().getContentType(), MediaType.APPLICATION_OCTET_STREAM);

        CompletableFuture<CreateMultipartUploadResponse> s3AsyncClientMultipartUpload = s3AsyncClient
            .createMultipartUpload(CreateMultipartUploadRequest.builder()
                .contentType(mediaType.toString())
                .key(upload_key)
                .metadata(metadata)
                .checksumAlgorithm(ChecksumAlgorithm.CRC32)
                .bucket(s3ConfigProperties.getS3BucketName())
                .build());

        UploadStatus uploadStatus = new UploadStatus(Objects.requireNonNull(filePart.headers().getContentType()).toString(), upload_key);

        return Mono.fromFuture(s3AsyncClientMultipartUpload)
            .flatMapMany(response -> {
                FileUtils.checkSdkResponse(response);
                uploadStatus.setUploadId(response.uploadId());
                System.out.println("Upload object with ID=" + response.uploadId());
                return filePart.content();
            })
            .bufferUntil(dataBuffer -> {
                // Collect incoming values into multiple List buffers that will be emitted by the resulting Flux each time the given predicate returns true.
                uploadStatus.addBuffered(dataBuffer.readableByteCount());

                if (uploadStatus.getBuffered() >= s3ConfigProperties.getMultipartMinPartSize()) {
                    System.out.printf("BufferUntil - returning true, bufferedBytes=%s, partCounter=%s, uploadId=%s",
                        uploadStatus.getBuffered(), uploadStatus.getPartCounter(), uploadStatus.getUploadId());
                    // reset buffer
                    uploadStatus.setBuffered(0);
                    return true;
                }

                return false;
            })
            .map(FileUtils::dataBufferToByteBuffer)
            // upload partndicates that a request cannot get a connection from the pool within the specified maximum time. This c
            .flatMap(byteBuffer -> uploadPartObject(uploadStatus, byteBuffer))
            .onBackpressureBuffer()
            .reduce(uploadStatus, (status, completedPart) -> {
                System.out.printf("Completed: PartNumber=%d, etag=%s", completedPart.partNumber(), completedPart.eTag());
                (status).getCompletedParts().put(completedPart.partNumber(), completedPart);
                return status;
            })
            .flatMap(uploadStatus1 -> completeMultipartUpload(uploadStatus))
            .map(response -> {
                FileUtils.checkSdkResponse(response);
                System.out.printf("upload result: %s", response.toString());
                return new FileResponse(filename, uploadStatus.getUploadId(), response.location(), uploadStatus.getContentType(), response.eTag());
            });
    }

    /**
     * Uploads a part in a multipart upload.
     */
    private Mono<CompletedPart> uploadPartObject(UploadStatus uploadStatus, ByteBuffer buffer) {
        final int partNumber = uploadStatus.getAddedPartCounter();
        String checksum = calculateBase64EncodedCRC32Checksum(buffer);
        System.out.printf("UploadPart - partNumber=%d, contentLength=%d checksum=%s\n", partNumber, buffer.capacity(), checksum);
        CompletableFuture<UploadPartResponse> uploadPartResponseCompletableFuture = s3AsyncClient.uploadPart(UploadPartRequest.builder()
                .bucket(s3ConfigProperties.getS3BucketName())
                .key(uploadStatus.getFileKey())
                .partNumber(partNumber)
                .contentLength((long) buffer.capacity())
                .checksumAlgorithm(ChecksumAlgorithm.CRC32)
                .uploadId(uploadStatus.getUploadId())
                .build(),
            AsyncRequestBody.fromByteBuffer(buffer));

        return Mono
            .fromFuture(uploadPartResponseCompletableFuture)
            .map(uploadPartResult -> {
                FileUtils.checkSdkResponse(uploadPartResult);
                System.out.printf("UploadPart - complete: part=%d, etag=%s, checksum=%s\n", partNumber, uploadPartResult.eTag(), uploadPartResult.checksumCRC32());
                if (!checksum.equals(uploadPartResult.checksumCRC32())) {
                    throw new RuntimeException("Checksum mismatch");
                }
                return CompletedPart.builder()
                    .checksumCRC32(uploadPartResult.checksumCRC32())
                    .eTag(uploadPartResult.eTag())
                    .partNumber(partNumber)
                    .build();
            })
            .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                .filter(throwable -> throwable instanceof RuntimeException && throwable.getMessage().contains("Checksum mismatch")) // Retry only on checksum mismatch
                .onRetryExhaustedThrow((retryBackoffSpec, retrySignal) ->
                    {
                        System.out.println("failed");
                        return new RuntimeException("Failed to upload part after 3 attempts due to checksum mismatch.", retrySignal.failure());
                    }
                ));
    }

    /**
     * This method is called when a part finishes uploading. It's primary function is to verify the ETag of the part
     * we just uploaded.
     */
    private Mono<CompleteMultipartUploadResponse> completeMultipartUpload(UploadStatus uploadStatus) {
        System.out.printf("CompleteUpload - fileKey=%s, completedParts.size=%d\n",
            uploadStatus.getFileKey(), uploadStatus.getCompletedParts().size());

        CompletedMultipartUpload multipartUpload = CompletedMultipartUpload.builder()
            .parts(uploadStatus.getCompletedParts().values())
            .build();

        return Mono.fromFuture(s3AsyncClient.completeMultipartUpload(CompleteMultipartUploadRequest.builder()
            .bucket(s3ConfigProperties.getS3BucketName())
            .uploadId(uploadStatus.getUploadId())
            .multipartUpload(multipartUpload)
            .key(uploadStatus.getFileKey())
            .build()));
    }

    public Mono<Boolean> uploadJson(String filename) {
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(s3ConfigProperties.getS3BucketName())
            .key("json/" + filename)
            .build();

        return Mono.fromFuture(() -> s3AsyncClient.putObject(putObjectRequest,
                AsyncRequestBody.fromFile(Paths.get("json/" + filename))))
            .map(response -> true);
    }
}
