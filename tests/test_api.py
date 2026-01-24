import pytest
from fastapi import HTTPException

from backendapp.main import (
    ItemCreate,
    ItemUpdate,
    app,
    create_item,
    delete_item,
    get_item,
    list_items,
    read_health,
    reset_store,
    update_item,
)


@pytest.fixture(autouse=True)
def clean_store():
    reset_store()
    yield
    reset_store()


def _sample_item(name: str = "Sample") -> ItemCreate:
    return ItemCreate(
        name=name,
        description="An example item used in tests",
        price=9.99,
        tags=["example", "test"],
    )


def test_health_endpoint():
    assert read_health() == {"status": "ok"}


def test_openapi_version_is_explicitly_three_zero_three():
    spec = app.openapi()
    assert spec.get("openapi") == "3.0.3"


def test_create_and_fetch_item():
    created = create_item(_sample_item("Widget"))
    assert created.id == 1
    assert created.name == "Widget"

    fetched = get_item(created.id)
    assert fetched.name == "Widget"
    assert fetched.id == created.id


def test_list_items_returns_all_created_items():
    create_item(_sample_item("First"))
    create_item(_sample_item("Second"))

    items = list_items()
    names = [item.name for item in items]
    assert names == ["First", "Second"]


def test_update_item_replaces_fields():
    created = create_item(_sample_item("Updatable"))

    updated = update_item(
        created.id, ItemUpdate(description="Updated", price=12.5, tags=["updated"])
    )
    assert updated.description == "Updated"
    assert updated.price == 12.5
    assert updated.tags == ["updated"]


def test_delete_item_removes_entry():
    created = create_item(_sample_item("Deletable"))

    result = delete_item(created.id)
    assert result == {"status": "deleted", "id": created.id}

    with pytest.raises(HTTPException) as exc_info:
        get_item(created.id)
    assert exc_info.value.status_code == 404
