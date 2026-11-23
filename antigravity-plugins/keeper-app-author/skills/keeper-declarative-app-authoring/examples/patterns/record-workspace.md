# Pattern: Record Workspace

Composition recipe for a route-bound record workspace. Select this shape in
[App design](../../design/app-design.md); use it for a primary record that needs
related context, explicit editing, workflow actions, or a stable deep link.

```yaml
view: {id: item-detail, title: Work item}
nav: {visible: false}
route_state:
  selectedItemId: itemId
state:
  selectedItemId: ""
data_sources:
  selected_item:
    kind: record
    table: work_items
    id: {bind: state.selectedItemId}
    refresh_on: [state.selectedItemId]
  complete_item_action:
    kind: provider_resource
    provider: workspace
    resource: workflow_action
    params:
      workflow_id: complete_work_item
      label: Complete item
      input__work_item_id: {bind: state.selectedItemId}
components:
  item_detail:
    kind: record_detail
    table: work_items
    data_source: selected_item
    actions_source: complete_item_action
    mode: editable
    show_primary_key: false
    header:
      title_field: {field: summary, mode: edit}
      meta_fields:
        - {field: status, mode: edit, ui: {variant: badge}}
        - {field: priority, mode: edit, ui: {variant: badge}}
    sections:
      - id: details
        fields:
          - field: description
            mode: edit
            contentFormat: markdown
            ui: {variant: markdown, width: full, chrome: plain}
layout: {component: item_detail}
```

Create `complete_work_item` in the same scope or omit its action source. Queue/table navigation must
pass `itemId`. Add related sources only when the detail genuinely uses them.
