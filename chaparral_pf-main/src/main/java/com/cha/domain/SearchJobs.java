package com.cha.domain;

import com.cha.config.Constants;
import io.r2dbc.postgresql.codec.Json;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.UUID;

/**
 * A user.
 */
@Table("jhi_search_jobs")
@Data
@Component
public class SearchJobs extends AbstractAuditingEntity<Long> implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    private Long id;
    private UUID batchJobId;
    private String batchJobStatus;
    private Json params;
    private String searchResultsPrefix;
}
//    CREATE TABLE SearchJobs (
//    id uuid not null primary key,
//    organization_id uuid not null,
//    batch_job_id uuid,
//    batch_job_status text,
//    params json not null,
//  -- search_results_prefix will be `s3://search-results/organization_0000/proj_0000/<id>/`
//        search_results_prefix text not null,
//    foreign key ("organization_id") references "organizations"("id")
//    );
