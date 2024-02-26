package com.cha.repository;

import com.cha.domain.Organization;
import com.cha.domain.Project;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface OrganizationRepository extends R2dbcRepository<Organization, Integer> {
    Mono<Organization> findOneByUserId(Long userid);
}
