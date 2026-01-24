export type Item = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  tags: string[];
};

export type ItemCreate = {
  name: string;
  description?: string;
  price: number;
  tags: string[];
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const detail = await safeJson(response);
    throw new Error(detail?.detail ?? `Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

async function safeJson(response: Response): Promise<any | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const result = await request<{ status: string }>("/health");
    return result.status === "ok";
  } catch {
    return false;
  }
}

export async function fetchItems(): Promise<Item[]> {
  return request<Item[]>("/items");
}

export async function createItem(payload: ItemCreate): Promise<Item> {
  return request<Item>("/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteItem(id: number): Promise<void> {
  await request(`/items/${id}`, { method: "DELETE" });
}
