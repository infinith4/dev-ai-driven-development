package com.example.backend.controller;

import com.example.backend.model.ItemRequest;
import com.example.backend.model.ItemResponse;
import com.example.backend.model.ItemUpdate;
import com.example.backend.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "ok");
        return status;
    }

    @GetMapping("/items")
    public List<ItemResponse> list() {
        return itemService.list();
    }

    @PostMapping("/items")
    public ResponseEntity<ItemResponse> create(@Valid @RequestBody ItemRequest request) {
        ItemResponse created = itemService.create(request);
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<ItemResponse> get(@PathVariable int id) {
        return itemService.get(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ItemResponse> update(@PathVariable int id, @Valid @RequestBody ItemUpdate update) {
        return itemService.update(id, update)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id) {
        boolean removed = itemService.delete(id);
        if (!removed) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("status", "deleted");
        response.put("id", id);
        return ResponseEntity.ok(response);
    }
}
