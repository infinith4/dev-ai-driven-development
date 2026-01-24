package com.example.backend.service;

import com.example.backend.model.ItemRequest;
import com.example.backend.model.ItemResponse;
import com.example.backend.model.ItemUpdate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ItemService {

    private final Map<Integer, ItemResponse> store = new ConcurrentHashMap<>();
    private final AtomicInteger nextId = new AtomicInteger(1);

    public List<ItemResponse> list() {
        return Collections.unmodifiableList(new ArrayList<>(store.values()));
    }

    public ItemResponse create(ItemRequest request) {
        int id = nextId.getAndIncrement();
        ItemResponse response = new ItemResponse(id, request.name(), request.description(), request.price(), request.tags() == null ? List.of() : request.tags());
        store.put(id, response);
        return response;
    }

    public Optional<ItemResponse> get(int id) {
        return Optional.ofNullable(store.get(id));
    }

    public Optional<ItemResponse> update(int id, ItemUpdate update) {
        ItemResponse existing = store.get(id);
        if (existing == null) {
            return Optional.empty();
        }
        ItemResponse updated = new ItemResponse(
                id,
                update.name() != null ? update.name() : existing.name(),
                update.description() != null ? update.description() : existing.description(),
                update.price() != null ? update.price() : existing.price(),
                update.tags() != null ? update.tags() : existing.tags()
        );
        store.put(id, updated);
        return Optional.of(updated);
    }

    public boolean delete(int id) {
        return store.remove(id) != null;
    }

    public void reset() {
        store.clear();
        nextId.set(1);
    }
}
