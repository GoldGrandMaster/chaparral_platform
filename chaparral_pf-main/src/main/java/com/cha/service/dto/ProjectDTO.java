package com.cha.service.dto;

import com.cha.domain.Project;
import lombok.Data;

import java.io.Serializable;
@Data
public class ProjectDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    private Long id;
    private String name;
    private String description;
    public ProjectDTO(Project project) {
        id = project.getId();
        name = project.getName();
        description = project.getDescription();
    }
}
