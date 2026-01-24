package com.example.backend.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ItemRequest(
        @NotBlank @Size(min = 1, max = 255) String name,
        @Size(max = 1024) String description,
        @NotNull @Min(0) Double price,
        List<@NotBlank String> tags
) {
}
