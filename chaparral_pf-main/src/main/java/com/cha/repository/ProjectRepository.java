package com.cha.repository;

import com.cha.domain.Project;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface ProjectRepository extends R2dbcRepository<Project, Integer> {
    Flux<Project> findAllByUserIdOrderById(Mono<Long> id);
}
