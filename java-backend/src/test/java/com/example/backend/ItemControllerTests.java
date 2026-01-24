package com.example.backend;

import com.example.backend.model.ItemRequest;
import com.example.backend.service.ItemService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ItemControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ItemService itemService;

    @BeforeEach
    void setup() {
        itemService.reset();
    }

    @Test
    void health_should_return_ok() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));
    }

    @Test
    void openapi_should_be_available() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.openapi").exists());
    }

    @Test
    void crud_flow_should_work() throws Exception {
        ItemRequest request = new ItemRequest("Widget", "Test item", 9.99, java.util.List.of("demo"));

        // create
        String body = objectMapper.writeValueAsString(request);
        mockMvc.perform(post("/items").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Widget"));

        // list
        mockMvc.perform(get("/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(1)));

        // get
        mockMvc.perform(get("/items/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Widget"));

        // update
        String updateBody = """
                { "description": "Updated", "price": 12.5, "tags": ["updated"] }
                """;
        mockMvc.perform(put("/items/1").contentType(MediaType.APPLICATION_JSON).content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Updated"))
                .andExpect(jsonPath("$.price").value(12.5));

        // delete
        mockMvc.perform(delete("/items/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("deleted"));

        mockMvc.perform(get("/items/1"))
                .andExpect(status().isNotFound());
    }
}
