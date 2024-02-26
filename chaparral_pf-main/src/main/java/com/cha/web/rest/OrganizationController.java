package com.cha.web.rest;

import com.cha.domain.Organization;
import com.cha.service.OrganizationService;
import com.cha.service.UserService;
import com.cha.web.rest.errors.LoginAlreadyUsedException;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api/organization")
public class OrganizationController {
    private final UserService userService;
    private final OrganizationService organizationService;
    public OrganizationController(UserService userService, OrganizationService organizationService) {
        this.userService = userService;
        this.organizationService = organizationService;
    }

    @PostMapping("/update")
    public Mono<Boolean> updateOrgName(@RequestBody String name) {
        if(name.isEmpty()) return Mono.error(new RuntimeException("Name must not be empty string"));
        return organizationService.setName(name);
    }
}
