# Board Example

This is a complete, data-free collaborative Kanban app with one `record_board` view. Read all six
descriptors before adapting it:

```text
app.yaml
schemas/tasks.yaml
schemas/task_checklist_items.yaml
schemas/task_activity.yaml
schemas/task_links.yaml
views/board.yaml
```

The example keeps the user's work inside the board:

- useful card content: priority, owner, due date, labels, and progress;
- search and facets across the work rather than navigation-only columns;
- inline creation, persisted rank, card movement, a WIP limit, completion timestamps, and archive;
- a selected-card workspace with autosaved fields, checklist, activity, and links;
- automatic checklist-derived progress with an explicit manual mode; and
- movement events in the same activity stream as user comments.

Adapt domain-owned identifiers, labels, fields, select values, and optional sections. Preserve the
descriptor envelopes, top-level `nav`, flat provider params, mutable table source, writable
select-backed group field, selection bindings, and action/component/layout references.

Keep `task_checklist_rollup` unfiltered: card progress needs all checklist rows. Keep the three
display sources filtered by `state.selectedTaskId`, and preset that same relation in their create
actions. Removing a related feature means removing its section, schema, sources, action source,
and any board capability that references it.

The example intentionally contains no `data/*.jsonl`. Do not add or replace installed user data
when adapting it for a definition-only update.
