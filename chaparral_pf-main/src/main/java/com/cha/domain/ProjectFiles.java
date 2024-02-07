package com.cha.domain;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.io.Serializable;

/**
 * A user.
 */
@Table("jhi_project_files")
public class ProjectFiles extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @Size(min = 1, max = 255)
    private String fileName;
    @Size(min = 1, max = 10)
    private String batchStatus;
    @Size(min = 1, max = 255)
    private String destinationPath;
    @NotNull
    private Long projectId;
    @NotNull
    private Long batchJobId;
    public ProjectFiles(Long projectId, String fileName, String destinationPath, Long batchJobId, String batchStatus) {
        this.fileName = fileName;
        this.batchStatus = batchStatus;
        this.destinationPath = destinationPath;
        this.projectId = projectId;
        this.batchJobId = batchJobId;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProjectFiles)) {
            return false;
        }
        return id != null && id.equals(((ProjectFiles) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "User{" +
//            "name='" + name + '\'' +
//            ", description='" + description + '\'' +
            "}";
    }


    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getBatchStatus() {
        return batchStatus;
    }

    public void setBatchStatus(String batchStatus) {
        this.batchStatus = batchStatus;
    }

    public String getDestinationPath() {
        return destinationPath;
    }

    public void setDestinationPath(String destinationPath) {
        this.destinationPath = destinationPath;
    }

    public Long getBatchJobId() {
        return batchJobId;
    }

    public void setBatchJobId(Long batchJobId) {
        this.batchJobId = batchJobId;
    }
}
