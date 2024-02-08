package com.cha.web.rest;


import com.cha.domain.Project;
import com.cha.domain.ProjectFiles;
import com.cha.domain.User;
import com.cha.repository.ProjectFilesRepository;
import com.cha.repository.ProjectRepository;
import com.cha.repository.UserRepository;
import com.cha.security.SecurityUtils;
import com.cha.web.rest.vm.ProjectVM;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@RestController
@RequestMapping("/api/projects")
public class ProjectResource {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectFilesRepository projectFilesRepository;

    public ProjectResource(ProjectRepository projectRepository, UserRepository userRepository, ProjectFilesRepository projectFilesRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectFilesRepository = projectFilesRepository;
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
    public Flux<Project> getProjectList(@RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectRepository.findAllByUserIdOrderById(SecurityUtils.getCurrentUserLogin().flatMap(login -> getUserIdFromLogin(login)));//ByOrderById(pageable);
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
    /*
    //This is for multiple file uploading
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "/upload")
    public Mono<Boolean> uploadFiles(@RequestPart("files") Flux<FilePart> files,
                                     @RequestPart("project_id") Mono<String> proj_id) {
        Path directory = Paths.get("upload");
        try {
            Files.createDirectories(directory);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Flux<Boolean> result = files.flatMap(filePart -> {
            // Save the file to the directory
            return filePart.transferTo(directory.resolve(filePart.filename()))
                .then(
                    Mono.just("File uploaded successfully")
                )
                .flatMap(str -> {
                    System.out.println("Received file: " + filePart.filename());
                    return proj_id.flatMap(id -> {
                        ProjectFiles projectFiles = new ProjectFiles(Long.valueOf(id),
                            filePart.filename(),
                            "http://s3",
                            1L,
                            "done"
                        );
                        //do aws
                        return projectFilesRepository.save(projectFiles)
                            .flatMap(val -> {
                                System.out.println("success");
                                return Mono.just(true);
                            })
                            .onErrorResume(throwable -> Mono.just(false));
                    });
                })
                .onErrorResume(throwable -> Mono.just(false));
        });
        return result.all(done->done);
    }
     */

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "/upload")
    public Mono<Boolean> uploadFiles(@RequestPart("file") Mono<FilePart> file,
                                     @RequestPart("project_id") Mono<String> proj_id) {
        Path directory = Paths.get("upload");
        try {
            Files.createDirectories(directory);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return file.flatMap(filePart -> {
            // Save the file to the directory
            return filePart.transferTo(directory.resolve(filePart.filename()))
                .then(
                    Mono.just("File uploaded successfully")
                )
                .flatMap(str -> {
                    System.out.println("Received file: " + filePart.filename());
                    return proj_id.flatMap(id -> {
                        System.out.println("project_id: " + id);
                        ProjectFiles projectFiles = new ProjectFiles(Long.valueOf(id),
                            filePart.filename(),
                            "http://s3",
                            1L,
                            "done"
                        );
                        //do aws
                        return projectFilesRepository.save(projectFiles)
                            .flatMap(val -> {
                                System.out.println("success");
                                return Mono.just(true);
                            })
                            .onErrorResume(throwable -> Mono.just(false));
                    });
                })
                .onErrorResume(throwable -> Mono.just(false));
        });
    }
}
