import { FormEvent, useState } from "react";
import { ItemCreate } from "../api";

type Props = {
  onSubmit: (payload: ItemCreate) => Promise<void>;
};

export function ItemForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [tags, setTags] = useState("demo, starter");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Shiny widget"
        />
      </div>
      <div className="field">
        <label>Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What makes it special?"
        />
      </div>
      <div className="field">
        <label>Price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="19.99"
        />
      </div>
      <div className="field">
        <label>Tags (comma separated)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="demo, starter"
        />
      </div>
      <div className="actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Item"}
        </button>
        <button
          type="button"
          className="button-ghost"
          onClick={() => {
            setName("");
            setDescription("");
            setPrice(0);
            setTags("");
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
}
