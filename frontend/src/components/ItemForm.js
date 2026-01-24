import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export function ItemForm({ onSubmit }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [tags, setTags] = useState("demo, starter");
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim())
            return;
        setSubmitting(true);
        try {
            await onSubmit({
                name: name.trim(),
                description: description.trim() || undefined,
                price: price || 0,
                tags: tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            });
            setName("");
            setDescription("");
            setPrice(0);
            setTags("demo, starter");
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("form", { className: "form", onSubmit: handleSubmit, children: [_jsxs("div", { className: "field", children: [_jsx("label", { children: "Name" }), _jsx("input", { required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Shiny widget" })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: "Description" }), _jsx("input", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "What makes it special?" })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: "Price" }), _jsx("input", { type: "number", min: "0", step: "0.01", value: price, onChange: (e) => setPrice(Number(e.target.value)), placeholder: "19.99" })] }), _jsxs("div", { className: "field", children: [_jsx("label", { children: "Tags (comma separated)" }), _jsx("input", { value: tags, onChange: (e) => setTags(e.target.value), placeholder: "demo, starter" })] }), _jsxs("div", { className: "actions", children: [_jsx("button", { type: "submit", disabled: submitting, children: submitting ? "Adding..." : "Add Item" }), _jsx("button", { type: "button", className: "button-ghost", onClick: () => {
                            setName("");
                            setDescription("");
                            setPrice(0);
                            setTags("");
                        }, children: "Clear" })] })] }));
}
