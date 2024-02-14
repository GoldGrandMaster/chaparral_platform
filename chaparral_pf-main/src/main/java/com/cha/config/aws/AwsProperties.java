package com.cha.config.aws;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Properties specific to aws client.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 */
//@Configuration
//public class AwsProperties {
//
//    /**
//     *  Aws access key ID
//     */
//    @Value("${aws.access-key}")
//    public String accessKey;
//
//
//    /**
//     *  Aws secret access key
//     */
//    @Value("${aws.secret-key}")
//    public String secretKey;
//
//    /**
//     *  Aws region
//     */
//    @Value("${aws.region}")
//    public String region;
//    /**
//     *  Aws S3 bucket name
//     */
//    @Value("${aws.s3-bucket-name}")
//    public String s3BucketName;
//
//    /**
//     * AWS S3 requires that file parts must have at least 5MB, except for the last part.
//     */
//
//    @Value("${aws.multipart-min-part-size}")
//    public int multipartMinPartSize;
//
//    /**
//     * S3 endpoint url
//     */
//    @Value("${aws.endpoint}")
//    public String endpoint;
//    public AwsProperties() {
//
//    }
//    public String getRegion(){return region;}
//    public String getAccessKey(){return accessKey;}
//    public String getSecretKey(){return secretKey;}
//    public String getS3BucketName(){return s3BucketName;}
//    public int getMultipartMinPartSize(){return multipartMinPartSize;}
//}
@Data
@Component
@ConfigurationProperties(prefix = "aws", ignoreUnknownFields = false)
public class AwsProperties {

    /**
     *  Aws access key ID
     */
    public String accessKey;


    /**
     *  Aws secret access key
     */
    public String secretKey;

    /**
     *  Aws region
     */
    public String region;
    /**
     *  Aws S3 bucket name
     */
    public String s3BucketName;

    /**
     * AWS S3 requires that file parts must have at least 5MB, except for the last part.
     */

    public int multipartMinPartSize;

    /**
     * S3 endpoint url
     */
    public String endpoint;
}
