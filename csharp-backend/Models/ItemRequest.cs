namespace BackendApi.Models;

public record ItemRequest(
    string Name,
    string? Description,
    double Price,
    List<string> Tags
);
