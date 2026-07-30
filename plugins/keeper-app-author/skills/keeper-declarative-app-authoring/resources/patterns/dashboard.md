# Pattern: Read-only Dashboard Projection

Use only when a join, derived field, or richer filter is required. Create an output schema for every
mapped projection field, then render the projection with read-only components.

```yaml
view: {id: dashboard, title: Open work}
nav: {order: 30}
data_sources:
  work_items: {kind: table, table: work_items}
  people: {kind: table, table: people}
  open_work_items:
    kind: projected_table
    schema: open_work_items
    from: {source: work_items, as: item}
    lookups:
      - {source: people, as: owner, local: item.owner_id, foreign: id, mode: left}
    where:
      - kind: script
        input:
          status: {path: item.status}
        code: return input.status !== "completed";
    fields:
      - {field: id, value: {path: item.id}}
      - {field: summary, value: {path: item.summary}}
      - field: owner_name
        value:
          op: coalesce
          values: [{path: owner.name}, {literal: Unassigned}]
      - {field: status, value: {path: item.status}}
components:
  open_items:
    kind: record_table
    data_source: open_work_items
    columns: [summary, owner_name, status]
    on_row_click:
      - type: navigate
        viewId: item-detail
        query:
          itemId: {bind: record.id}
layout: {component: open_items}
```

`schemas/open_work_items.yaml` must define `id`, `summary`, `owner_name`, and `status`. Do not add
editable components or mutation controls over the projection.
