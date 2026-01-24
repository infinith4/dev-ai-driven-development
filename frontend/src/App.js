import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { checkHealth, createItem, deleteItem, fetchItems } from "./api";
import { ItemCard } from "./components/ItemCard";
import { ItemForm } from "./components/ItemForm";
import "./styles.css";
export default function App() {
    const [items, setItems] = useState([]);
    const [health, setHealth] = useState("unknown");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
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
        }
        catch (error) {
            setHealth("offline");
            setMessage(error.message ?? "Unable to reach backend");
        }
        finally {
            setLoading(false);
        }
    }
    async function handleCreate(payload) {
        try {
            const created = await createItem(payload);
            setItems((prev) => [...prev, created]);
            setMessage(null);
            setHealth("online");
        }
        catch (error) {
            setMessage(error.message ?? "Unable to create item");
        }
    }
    async function handleDelete(id) {
        try {
            await deleteItem(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
        }
        catch (error) {
            setMessage(error.message ?? "Unable to delete item");
        }
    }
    return (_jsxs("div", { className: "page", children: [_jsxs("div", { className: "header", children: [_jsxs("span", { className: "eyebrow", children: [_jsx("span", { children: "Frontend" }), "reacts to the FastAPI backend"] }), _jsxs("div", { className: "title", children: ["AI-driven Items ", _jsx("span", { style: { color: "var(--accent)" }, children: "Console" })] }), _jsx("p", { className: "lead", children: "A lightweight React + Vite frontend that speaks to the FastAPI backend. Create items, see them stream into the grid, and manage tags with a couple clicks." })] }), _jsxs("div", { className: "panel", children: [_jsx("div", { className: `status-dot status-${health}` }), _jsxs("div", { children: [_jsx("strong", { children: "Status: " }), health === "online"
                                ? "Backend is online"
                                : health === "offline"
                                    ? "Backend not reachable"
                                    : "Checking backend..."] }), _jsxs("div", { className: "pill", children: ["Items: ", itemCount] }), _jsxs("div", { className: "pill", children: ["API base: ", _jsx("code", { children: import.meta.env.VITE_API_BASE ?? "http://localhost:8000" })] }), _jsx("button", { className: "button-ghost", onClick: refresh, disabled: loading, children: loading ? "Refreshing..." : "Refresh" })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "New item" }), _jsx(ItemForm, { onSubmit: handleCreate })] }), _jsx("hr", { className: "divider" }), message && _jsxs("div", { className: "alert", children: ["\u26A0\uFE0F ", message] }), loading ? (_jsx("div", { className: "empty", children: "Loading items..." })) : items.length === 0 ? (_jsx("div", { className: "empty", children: "No items yet. Add your first one to see it appear here." })) : (_jsx("div", { className: "cards", children: items.map((item) => (_jsx(ItemCard, { item: item, onDelete: handleDelete }, item.id))) }))] }));
}
