const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";
async function request(path, options) {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!response.ok) {
        const detail = await safeJson(response);
        throw new Error(detail?.detail ?? `Request failed: ${response.status}`);
    }
    return (await response.json());
}
async function safeJson(response) {
    try {
        return await response.json();
    }
    catch {
        return null;
    }
}
export async function checkHealth() {
    try {
        const result = await request("/health");
        return result.status === "ok";
    }
    catch {
        return false;
    }
}
export async function fetchItems() {
    return request("/items");
}
export async function createItem(payload) {
    return request("/items", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
export async function deleteItem(id) {
    await request(`/items/${id}`, { method: "DELETE" });
}
