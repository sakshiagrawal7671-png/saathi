package com.saathi.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class FamilyMemberRequest {
    @NotBlank private String name;
    @NotBlank private String relationship;
    private String phone;
    private String email;
    private String avatarUrl;
    private LocalDate birthday;
    private String notes;
}
