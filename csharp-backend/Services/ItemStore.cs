using System.Collections.Concurrent;
using BackendApi.Models;

namespace BackendApi.Services;

public class ItemStore
{
    private readonly ConcurrentDictionary<int, ItemResponse> _items = new();
    private int _nextId = 1;

    public List<ItemResponse> List() => _items.Values.OrderBy(i => i.Id).ToList();

    public ItemResponse Create(ItemRequest request)
    {
        ValidateRequest(request);
        var id = Interlocked.Increment(ref _nextId) - 1;
        var response = new ItemResponse(
            id,
            request.Name,
            request.Description,
            request.Price,
            request.Tags ?? new List<string>()
        );
        _items[id] = response;
        return response;
    }

    public ItemResponse? Get(int id) => _items.TryGetValue(id, out var item) ? item : null;

    public ItemResponse? Update(int id, ItemUpdate update)
    {
        if (!_items.TryGetValue(id, out var existing)) return null;
        var updated = new ItemResponse(
            id,
            update.Name ?? existing.Name,
            update.Description ?? existing.Description,
            update.Price ?? existing.Price,
            update.Tags ?? existing.Tags
        );
        _items[id] = updated;
        return updated;
    }

    public bool Delete(int id) => _items.TryRemove(id, out _);

    public void Reset()
    {
        _items.Clear();
        _nextId = 1;
    }

    private static void ValidateRequest(ItemRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException("Name is required");
        }

        if (request.Price < 0)
        {
            throw new ArgumentException("Price must be non-negative");
        }
    }
}
