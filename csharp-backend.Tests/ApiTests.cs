using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using BackendApi;
using BackendApi.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Threading.Tasks;
using Xunit;

namespace CsharpBackend.Tests;

public class ApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(_ => { });
    }

    [Fact]
    public async Task Health_ReturnsOk()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/health");
        response.EnsureSuccessStatusCode();
        var payload = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.Equal("ok", payload?["status"]);
    }

    [Fact]
    public async Task Swagger_ReturnsOpenApi()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/swagger/v1/swagger.json");
        response.EnsureSuccessStatusCode();
        var doc = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(doc);
        Assert.True(doc!.ContainsKey("openapi"));
    }

    [Fact]
    public async Task Crud_Flow_Works()
    {
        var client = _factory.CreateClient();

        // Create
        var createResponse = await client.PostAsJsonAsync("/items",
            new ItemRequest("Widget", "Test item", 9.99, new List<string> { "demo" }));
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        var created = await createResponse.Content.ReadFromJsonAsync<ItemResponse>();
        Assert.NotNull(created);
        Assert.Equal(1, created!.Id);

        // List
        var list = await client.GetFromJsonAsync<List<ItemResponse>>("/items");
        Assert.Single(list!);

        // Get
        var fetched = await client.GetFromJsonAsync<ItemResponse>("/items/1");
        Assert.Equal("Widget", fetched!.Name);

        // Update
        var updateResponse = await client.PutAsJsonAsync("/items/1",
            new ItemUpdate(null, "Updated", 12.5, new List<string> { "updated" }));
        updateResponse.EnsureSuccessStatusCode();
        var updated = await updateResponse.Content.ReadFromJsonAsync<ItemResponse>();
        Assert.Equal("Updated", updated!.Description);
        Assert.Equal(12.5, updated.Price);

        // Delete
        var deleteResponse = await client.DeleteAsync("/items/1");
        deleteResponse.EnsureSuccessStatusCode();

        var missing = await client.GetAsync("/items/1");
        Assert.Equal(HttpStatusCode.NotFound, missing.StatusCode);
    }
}
