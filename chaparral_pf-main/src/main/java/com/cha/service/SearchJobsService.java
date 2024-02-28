package com.cha.service;

import com.cha.domain.SearchJobs;
import com.cha.repository.SearchJobsRepository;
import io.r2dbc.postgresql.codec.Json;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

/**
 * Service class for managing users.
 */
@Service
public class SearchJobsService {

    private final Logger log = LoggerFactory.getLogger(SearchJobsService.class);
    private final SearchJobsRepository searchJobsRepository;

    public SearchJobsService(SearchJobsRepository searchJobsRepository) {
        this.searchJobsRepository = searchJobsRepository;
    }
    public Mono<SearchJobs> saveNew(Json params, String path) {
        SearchJobs searchJobs = new SearchJobs();
        searchJobs.setBatchJobId(UUID.randomUUID());
        searchJobs.setParams(params);
        searchJobs.setBatchJobStatus("pending");
        searchJobs.setSearchResultsPrefix(path);
        return searchJobsRepository.save(searchJobs);
    }
}
