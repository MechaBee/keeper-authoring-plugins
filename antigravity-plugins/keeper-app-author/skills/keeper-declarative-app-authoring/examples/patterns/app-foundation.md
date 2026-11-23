# Pattern: App Foundation

Use the smallest complete foundation: `app.yaml`, the required schemas, and a default view. Add
queue, workspace, dashboard, workflow, agent, or seed data only when the brief asks for them.

```yaml
# app.yaml
id: work-tracker
title: Work Tracker
version: 1
defaultView: home
schemaVersion: 2
```

```yaml
# schemas/work_items.yaml
table: work_items
version: 2
primaryKey: id
idPrefix: item
displayField: summary
rowAccess: {mode: all} # choose the visibility required by the brief
fields:
  - {id: id, type: text, label: ID, readonly: true, required: true}
  - {id: summary, type: text, label: Summary, required: true}
  - id: status
    type: select
    label: Status
    required: true
    default: requested
    options:
      - {value: requested, label: Requested}
      - {value: active, label: Active}
      - {value: completed, label: Completed}
  - {id: due_date, type: date, label: Due date}
```

```yaml
# views/home.yaml
view: {id: home, title: Work items}
nav: {order: 10}
data_sources:
  work_items:
    kind: table
    table: work_items
    sort: {field: due_date, direction: asc}
components:
  work_items_table:
    kind: record_table
    data_source: work_items
    columns: [summary, status, due_date]
layout: {component: work_items_table}
```

Adapt every domain id and label consistently. Preserve runtime-owned keys and reserved binding
roots.
