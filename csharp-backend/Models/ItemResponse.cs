namespace BackendApi.Models;

public record ItemResponse(
    int Id,
    string Name,
    string? Description,
    double Price,
    List<string> Tags
);
