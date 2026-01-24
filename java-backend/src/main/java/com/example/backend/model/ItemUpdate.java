package com.example.backend.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ItemUpdate(
        @Size(min = 1, max = 255) String name,
        @Size(max = 1024) String description,
        @Min(0) Double price,
        List<@jakarta.validation.constraints.NotBlank String> tags
) {
}
