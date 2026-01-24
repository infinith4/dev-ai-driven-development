namespace BackendApi.Models;

public record ItemUpdate(
    string? Name,
    string? Description,
    double? Price,
    List<string>? Tags
);
