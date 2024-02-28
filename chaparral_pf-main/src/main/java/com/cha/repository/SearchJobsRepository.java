package com.cha.repository;

import com.cha.domain.Project;
import com.cha.domain.SearchJobs;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface SearchJobsRepository extends R2dbcRepository<SearchJobs, Integer> {
}
