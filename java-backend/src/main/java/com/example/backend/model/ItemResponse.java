package com.example.backend.model;

import java.util.List;

public record ItemResponse(
        int id,
        String name,
        String description,
        double price,
        List<String> tags
) {
}
