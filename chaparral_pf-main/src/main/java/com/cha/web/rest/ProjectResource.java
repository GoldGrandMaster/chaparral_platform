package com.cha.web.rest;


import com.cha.domain.Project;
import com.cha.domain.User;
import com.cha.repository.ProjectRepository;
import com.cha.repository.UserRepository;
import com.cha.security.SecurityUtils;
import com.cha.web.rest.vm.ProjectVM;
import jakarta.validation.Valid;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;



@RestController
@RequestMapping("/api/projects")
public class ProjectResource {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectResource(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    private Mono<Long> getUserIdFromLogin(String login) {
        // Logic to retrieve user ID from login (You should implement this method)
        // For demonstration purposes, returning a dummy value
        return userRepository.findOneByLogin(login).map(User::getId);
    }
    @PostMapping
    public Mono<Project> addProject(@Valid @RequestBody ProjectVM projectVM) {
        return SecurityUtils.getCurrentUserLogin()
            .flatMap(login -> getUserIdFromLogin(login)
                .flatMap(userId -> {
                    Project project = new Project(projectVM.getName(), projectVM.getDescription(), userId);
                    return projectRepository.save(project);
                }));
    }
    @GetMapping
    public Flux<Project> getProjectList(@RequestParam int page,@RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectRepository.findAllByUserIdOrderById(SecurityUtils.getCurrentUserLogin().flatMap(login -> getUserIdFromLogin(login)));//ByOrderById(pageable);
    }
    @DeleteMapping
    public Mono<Boolean> deleteProjects(@RequestBody  Integer[] ids) {
        Flux<Boolean> deletionOperations = Flux.fromArray(ids)
            .flatMap(id -> projectRepository.deleteById(id).then(Mono.just(true)))
            .onErrorResume(ex -> Mono.just(false));

        // Use all() to wait for all deletion operations to complete and return true if all are successful
        return deletionOperations.all(deleted -> deleted);
    }
    @PutMapping
    public Mono<Boolean> editProjects(@RequestBody ProjectVM projectVM) {
        Mono<Boolean> updateOperartion = projectRepository.findById(projectVM.getId())
            .flatMap(project -> {
                project.setDescription(projectVM.getDescription());
                project.setName(projectVM.getName());
                return projectRepository.save(project);
            })
            .flatMap(proj -> Mono.just(true)) // If update is successful, emit true
            .defaultIfEmpty(false); // If no project is found, emit false

        // Use all() to wait for all deletion operations to complete and return true if all are successful
        return updateOperartion;
    }
}
