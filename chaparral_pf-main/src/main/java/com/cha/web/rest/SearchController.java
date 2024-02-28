package com.cha.web.rest;

import com.cha.service.AWSS3FileStorageService;
import com.cha.service.SearchJobsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import io.r2dbc.postgresql.codec.Json;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;


@RestController
@RequestMapping("/api/search")
public class SearchController {
    private final AWSS3FileStorageService fileStorageService;
    private final SearchJobsService searchJobsService;

    public SearchController(AWSS3FileStorageService fileStorageService, SearchJobsService searchJobsService) {
        this.fileStorageService = fileStorageService;
        this.searchJobsService = searchJobsService;
    }

    @PostMapping
    public Mono<Boolean> search(@RequestBody Json s) throws IOException {
        Path directory = Paths.get("json");
        try {
            Files.createDirectories(directory);
        } catch (IOException e) {
            e.printStackTrace();
        }
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        String formatted = mapper.writeValueAsString(mapper.readValue(s.asString(), Object.class));
        String filename = UUID.randomUUID() + ".json";
        Files.write(Paths.get("json/" + filename), formatted.getBytes());
        return fileStorageService
            .uploadJson(filename)
            .flatMap(path->{
                try {
                    Files.delete(Paths.get("json/" + filename));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                return searchJobsService
                    .saveNew(s, path)
                    .map(obj->true);
            });
    }
}
