using BackendApi.Models;
using BackendApi.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ItemStore>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "C# Backend API",
        Version = "v1",
        Description = "Minimal API with in-memory item CRUD"
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }))
    .WithName("Health")
    .WithTags("Health");

app.MapGet("/items", (ItemStore store) => Results.Ok(store.List()))
    .WithName("ListItems")
    .WithTags("Items");

app.MapGet("/items/{id:int}", (int id, ItemStore store) =>
{
    var item = store.Get(id);
    return item is not null ? Results.Ok(item) : Results.NotFound();
}).WithName("GetItem").WithTags("Items");

app.MapPost("/items", (ItemRequest request, ItemStore store) =>
{
    var created = store.Create(request);
    return Results.Created($"/items/{created.Id}", created);
}).WithName("CreateItem").WithTags("Items");

app.MapPut("/items/{id:int}", (int id, ItemUpdate update, ItemStore store) =>
{
    var updated = store.Update(id, update);
    return updated is not null ? Results.Ok(updated) : Results.NotFound();
}).WithName("UpdateItem").WithTags("Items");

app.MapDelete("/items/{id:int}", (int id, ItemStore store) =>
{
    var removed = store.Delete(id);
    return removed
        ? Results.Ok(new { status = "deleted", id })
        : Results.NotFound();
}).WithName("DeleteItem").WithTags("Items");

app.Run();

public partial class Program { }
