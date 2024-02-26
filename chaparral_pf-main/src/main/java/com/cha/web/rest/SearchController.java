package com.cha.web.rest;

import com.cha.service.AWSS3FileStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;


@RestController
@RequestMapping("/api/search")
public class SearchController {
    private final AWSS3FileStorageService fileStorageService;

    public SearchController(AWSS3FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public Mono<Boolean> search(@RequestBody String s) throws IOException {
        Path directory = Paths.get("json");
        try {
            Files.createDirectories(directory);
        } catch (IOException e) {
            e.printStackTrace();
        }
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        String formatted = mapper.writeValueAsString(mapper.readValue(s, Object.class));
        String filename = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + UUID.randomUUID() + ".json";
        Files.write(Paths.get("json/" + filename), formatted.getBytes());
        return fileStorageService.uploadJson(filename);
    }
}
