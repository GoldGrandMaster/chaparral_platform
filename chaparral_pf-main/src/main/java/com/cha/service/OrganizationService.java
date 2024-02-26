package com.cha.service;

import com.cha.domain.Organization;
import com.cha.repository.OrganizationRepository;
import com.cha.repository.UserRepository;
import com.cha.security.SecurityUtils;
import com.cha.web.rest.errors.BadRequestAlertException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;


@Service
public class OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public OrganizationService(OrganizationRepository organizationRepository, UserRepository userRepository) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Mono<Boolean> setName(String name) {
        return SecurityUtils
            .getCurrentUserLogin()
            .flatMap(login -> userRepository
                .findOneByLogin(login)
                .flatMap(user -> organizationRepository
                    .findOneByUserId(user.getId())
                    .flatMap(organization -> {
                        organization.setName(name);
                        return organizationRepository
                            .save(organization)
                            .map(org->true);
                    })))
            .switchIfEmpty(Mono.error(new RuntimeException("Changing name failed")));
    }
}
