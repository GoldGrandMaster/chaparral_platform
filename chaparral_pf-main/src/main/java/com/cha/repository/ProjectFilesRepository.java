package com.cha.repository;

import com.cha.domain.ProjectFiles;
import org.springframework.data.r2dbc.repository.R2dbcRepository;


public interface ProjectFilesRepository extends R2dbcRepository<ProjectFiles, Integer> {

}
