import { useEffect, useMemo, useState } from "react";
import { Item, ItemCreate, checkHealth, createItem, deleteItem, fetchItems } from "./api";
import { ItemCard } from "./components/ItemCard";
import { ItemForm } from "./components/ItemForm";
import "./styles.css";

type Health = "online" | "offline" | "unknown";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [health, setHealth] = useState<Health>("unknown");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const itemCount = useMemo(() => items.length, [items]);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      const [healthOk, itemsResponse] = await Promise.all([checkHealth(), fetchItems()]);
      setHealth(healthOk ? "online" : "offline");
      setItems(itemsResponse);
      setMessage(null);
    } catch (error) {
      setHealth("offline");
      setMessage((error as Error).message ?? "Unable to reach backend");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(payload: ItemCreate) {
    try {
      const created = await createItem(payload);
      setItems((prev) => [...prev, created]);
      setMessage(null);
      setHealth("online");
    } catch (error) {
      setMessage((error as Error).message ?? "Unable to create item");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setMessage((error as Error).message ?? "Unable to delete item");
    }
  }

  return (
    <div className="page">
      <div className="header">
        <span className="eyebrow">
          <span>Frontend</span>
          reacts to the FastAPI backend
        </span>
        <div className="title">
          AI-driven Items <span style={{ color: "var(--accent)" }}>Console</span>
        </div>
        <p className="lead">
          A lightweight React + Vite frontend that speaks to the FastAPI backend. Create items, see them
          stream into the grid, and manage tags with a couple clicks.
        </p>
      </div>

      <div className="panel">
        <div className={`status-dot status-${health}`} />
        <div>
          <strong>Status: </strong>
          {health === "online"
            ? "Backend is online"
            : health === "offline"
              ? "Backend not reachable"
              : "Checking backend..."}
        </div>
        <div className="pill">Items: {itemCount}</div>
        <div className="pill">
          API base: <code>{import.meta.env.VITE_API_BASE ?? "http://localhost:8000"}</code>
        </div>
        <button className="button-ghost" onClick={refresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="card">
        <h3>New item</h3>
        <ItemForm onSubmit={handleCreate} />
      </div>

      <hr className="divider" />

      {message && <div className="alert">⚠️ {message}</div>}

      {loading ? (
        <div className="empty">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="empty">No items yet. Add your first one to see it appear here.</div>
      ) : (
        <div className="cards">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
