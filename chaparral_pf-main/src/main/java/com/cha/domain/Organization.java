package com.cha.domain;

import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Table("jhi_organization")
@Data
@Component
public class Organization extends AbstractAuditingEntity<Long> implements Serializable {

    @Id
    private Long id;
    @Size(min = 1, max = 255)
    private String name;
    private Long userId;

    @Override
    public Long getId() {
        return id;
    }
}
