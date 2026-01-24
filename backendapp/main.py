from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field


class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, description="Human-readable item name")
    description: Optional[str] = Field(None, description="Optional item description")
    price: float = Field(..., ge=0, description="Unit price in arbitrary currency")
    tags: List[str] = Field(default_factory=list, description="Labels that classify the item")


class ItemCreate(ItemBase):
    """Payload for creating an item."""


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, description="Updated item name")
    description: Optional[str] = Field(None, description="Updated description")
    price: Optional[float] = Field(None, ge=0, description="Updated price")
    tags: Optional[List[str]] = Field(None, description="Replace tags list")


class Item(ItemBase):
    id: int


class InMemoryStore:
    """Simple in-memory store for demo purposes."""

    def __init__(self) -> None:
        self._items: Dict[int, Item] = {}
        self._next_id = 1

    def list_items(self) -> List[Item]:
        return list(self._items.values())

    def create_item(self, payload: ItemCreate) -> Item:
        item = Item(id=self._next_id, **payload.model_dump())
        self._items[item.id] = item
        self._next_id += 1
        return item

    def get_item(self, item_id: int) -> Item:
        try:
            return self._items[item_id]
        except KeyError as exc:
            raise KeyError(f"Item {item_id} not found") from exc

    def update_item(self, item_id: int, payload: ItemUpdate) -> Item:
        if item_id not in self._items:
            raise KeyError(f"Item {item_id} not found")
        existing = self._items[item_id]
        updated = existing.model_copy(update=payload.model_dump(exclude_unset=True))
        self._items[item_id] = updated
        return updated

    def delete_item(self, item_id: int) -> None:
        if item_id not in self._items:
            raise KeyError(f"Item {item_id} not found")
        del self._items[item_id]

    def reset(self) -> None:
        self._items.clear()
        self._next_id = 1


app = FastAPI(
    title="Backend API",
    description="Minimal FastAPI backend exposing health and item CRUD endpoints.",
    version="1.0.0",
)
# FastAPI 0.110+ defaults to OpenAPI 3.1. Manually pin to 3.0.3 for compatibility.
app.openapi_version = "3.0.3"

store = InMemoryStore()


def _get_item_or_404(item_id: int) -> Item:
    try:
        return store.get_item(item_id)
    except KeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Item {item_id} not found"
        ) from exc


@app.get("/health", tags=["health"])
def read_health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/items", response_model=List[Item], tags=["items"])
def list_items() -> List[Item]:
    return store.list_items()


@app.post("/items", response_model=Item, status_code=status.HTTP_201_CREATED, tags=["items"])
def create_item(payload: ItemCreate) -> Item:
    return store.create_item(payload)


@app.get("/items/{item_id}", response_model=Item, tags=["items"])
def get_item(item_id: int) -> Item:
    return _get_item_or_404(item_id)


@app.put("/items/{item_id}", response_model=Item, tags=["items"])
def update_item(item_id: int, payload: ItemUpdate) -> Item:
    try:
        return store.update_item(item_id, payload)
    except KeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Item {item_id} not found"
        ) from exc


@app.delete("/items/{item_id}", tags=["items"])
def delete_item(item_id: int) -> dict[str, int | str]:
    try:
        store.delete_item(item_id)
    except KeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Item {item_id} not found"
        ) from exc
    return {"status": "deleted", "id": item_id}


def reset_store() -> None:
    """Reset the in-memory store (useful for tests)."""
    store.reset()
