import { Item } from "../api";

type Props = {
  item: Item;
  onDelete: (id: number) => Promise<void>;
};

export function ItemCard({ item, onDelete }: Props) {
  return (
    <div className="card">
      <h3>
        <span className="chip">#{item.id}</span>
        {item.name}
      </h3>
      {item.description && <p className="lead">{item.description}</p>}
      <div className="pill">
        <span className="price">${item.price.toFixed(2)}</span>
        <span>•</span>
        <span>{item.tags.length} tags</span>
      </div>
      <div className="tags">
        {item.tags.length ? (
          item.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))
        ) : (
          <span className="tag">untagged</span>
        )}
      </div>
      <div className="actions">
        <button className="button-ghost" onClick={() => onDelete(item.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
