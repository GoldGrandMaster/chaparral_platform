package com.cha.web.rest;


import com.cha.domain.Project;
import com.cha.domain.ProjectFiles;
import com.cha.classes.SuccessResponse;
import com.cha.domain.User;
import com.cha.repository.ProjectFilesRepository;
import com.cha.repository.ProjectRepository;
import com.cha.repository.UserRepository;
import com.cha.security.SecurityUtils;
import com.cha.service.AWSS3FileStorageService;
import com.cha.service.dto.ProjectDTO;
import com.cha.utils.FileUtils;
import com.cha.web.rest.vm.ProjectVM;
import jakarta.validation.Valid;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;


@RestController
@RequestMapping("/api/projects")
public class ProjectResource {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectFilesRepository projectFilesRepository;
    private final AWSS3FileStorageService fileStorageService;

    public ProjectResource(ProjectRepository projectRepository, UserRepository userRepository, ProjectFilesRepository projectFilesRepository, AWSS3FileStorageService fileStorageService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectFilesRepository = projectFilesRepository;
        this.fileStorageService = fileStorageService;
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
    public Flux<ProjectDTO> getProjectList(@RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectRepository
            .findAllByUserIdOrderById(SecurityUtils.getCurrentUserLogin().flatMap(this::getUserIdFromLogin))
            .map(ProjectDTO::new);
    }

    @DeleteMapping
    public Mono<Boolean> deleteProjects(@RequestBody Integer[] ids) {
        Flux<Boolean> deletionOperations = Flux.fromArray(ids)
            .flatMap(id -> projectRepository.deleteById(id).then(Mono.just(true)))
            .onErrorResume(ex -> Mono.just(false));

        // Use all() to wait for all deletion operations to complete and return true if all are successful
        return deletionOperations.all(deleted -> deleted);
    }

    @PutMapping
    public Mono<Void> editProjects(@RequestBody ProjectVM projectVM) {
        return projectRepository.findById(projectVM.getId())
            .flatMap(project -> {
                project.setDescription(projectVM.getDescription());
                project.setName(projectVM.getName());
                return projectRepository.save(project);
            }).then();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "/upload")
    public Mono<SuccessResponse> uploadFiles(@RequestPart("file") Mono<FilePart> file,
                                             @RequestPart("project_id") Mono<String> proj_id) {
        return proj_id.flatMap(id -> file
            .map(f -> {
                FileUtils.filePartValidator(f);
                return f;
            })
            .flatMap(filePart -> fileStorageService.uploadObject(filePart, id))
            .flatMap(fileResponse -> {
                System.out.println(fileResponse);
                ProjectFiles projectFiles = new ProjectFiles(Long.valueOf(id),
                    fileResponse.name(),
                    fileResponse.path(),
                    UUID.randomUUID(),
                    "done"
                );
                //do aws
                return projectFilesRepository.save(projectFiles)
                    .map(val -> {
                        System.out.println("success");
                        return new SuccessResponse(fileResponse, "Upload successfully");
                    });
            }));
    }
}
