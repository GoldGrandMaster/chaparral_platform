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

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<Boolean> editProject(@RequestPart("files") Flux<FilePart> files,
                                     @RequestPart("name") Mono<String> name,
                                     @RequestPart("id") Mono<String> id,
                                     @RequestPart("description") Mono<String> description) {
        return Mono.zip(id, name, description)
            .flatMap(tuple-> projectRepository.findById(Integer.valueOf(tuple.getT1()))
                .flatMap(project -> {
                    project.setDescription(tuple.getT3());
                    project.setName(tuple.getT2());
                    return projectRepository.save(project);
                })
                .map(proj -> {
//                    System.out.println(files.elementAt(0));
                    files.subscribe(filePart -> {
                            Path directory = Paths.get("upload");

                            // Ensure the directory exists, create it if it doesn't
                            try {
                                Files.createDirectories(directory);
                            } catch (IOException e) {
                                e.printStackTrace();
                            }

                            // Save the file to the directory
                            filePart.transferTo(directory.resolve(filePart.filename()))
                                .then(
                                    Mono.just("File uploaded successfully")
                                )
                                .subscribe(str->{
                                    System.out.println("Received file: " + filePart.filename());
                                    ProjectFiles projectFiles = new ProjectFiles(Long.valueOf(tuple.getT1()),
                                        filePart.filename(),
                                        "http://s3",
                                        1L,
                                        "done"
                                    );
                                    //do aws
                                    projectFilesRepository.save(projectFiles)
                                        .subscribe(val->{
                                            System.out.println("success");
                                        });
                                });
                    });
                    return false;
                }));
    }
}
