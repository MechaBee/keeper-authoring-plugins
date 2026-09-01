# Design: Shape And Views

Decide the app archetype, then decide the component for each view. Reach for a construct only when
its condition holds; the "not when" column is how apps go wrong. Each row points to the contract or
example that owns the grammar — read those, not this file, for keys.

## App archetype

Pick the one archetype the brief describes. Read every descriptor of its example before authoring.

| The brief is fundamentally about… | Anchor on | Read |
| --- | --- | --- |
| Capturing a few fields into a flat list | one `record_collection` view | [`../hello-notes`](../hello-notes/README.md) |
| Browsing records and drilling into one | `record_table`/`record_list` + route-bound `record_detail` | [`../four-view-crud`](../four-view-crud/README.md) |
| Moving work across named stages | a `record_board` grouped by a writable select | [`../board-example`](../board-example/README.md) |
| Read-only joined metrics or a report | a `projected_table` rendered read-only | [`patterns/dashboard`](../patterns/dashboard.md) |
| A multi-table operational domain (board + dashboard + related records + workflows + sharing + agent) | the operations desk | [`../operations-desk`](../operations-desk/README.md) |
| Logical records with dated successor versions and a current snapshot | effective-dated register | [`../effective-dated-rules`](../effective-dated-rules/README.md) |
| A small CRUD surface on DynamoDB | DynamoDB notes | [`../dynamodb-notes`](../dynamodb-notes/README.md) |

Do not blend archetypes to look more capable. A capture app does not need a dashboard; a browse app
does not need a board.

## Component per view

Classify each view's primary interaction first, then read the one component contract it needs from
[`../components-and-layout.md`](../components-and-layout.md).

| Reach for | when the view… | not when… |
| --- | --- | --- |
| `record_collection` | is a genuinely small, self-contained create/list/edit on one table | it is an operational queue, a record workspace, a dashboard, or drives automation — use the shapes below |
| `record_board` | groups rows by a **writable select** field on a **mutable** source, and users move rows between values | the source is a `projected_table` or `provider_resource` (those are read-only — a board there cannot save moves) |
| `record_table` | is a dense, column-oriented browse | one record needs its own editing/actions surface — pair the table with a route-bound `record_detail` instead |
| `record_list` | is a compact or card-style browse | you need columnar density — use `record_table` |
| `record_detail` (route-bound) | is the primary workspace for one record: deep-linkable, editable, carries workflow/direct actions | it is only previewing a row inside a browse — a table/list selection is enough |
| `record_form` | is a standalone create surface separate from any list | create belongs inline in a `record_collection` |
| `timesheet_week_grid` | is a rows × days time matrix | it is any other tabular shape — use `record_table` |
| a provider component (`stats_grid`, `timeline_panel`, `inbox_thread_panel`, `tree_panel`) | renders a `provider_resource` of that exact shape | the data is an app table — use a record component |

## Layout and navigation

A view is a composition container; a board, table, or detail is a component inside it, never its own
view type. After choosing components, read [`../contracts/views/layout.md`](../contracts/views/layout.md)
and [`../contracts/views/navigation.md`](../contracts/views/navigation.md).

A route-bound workspace is nav-hidden (`nav: {visible: false}`) and reached by a `navigate` action
that passes its route key — every hidden view must have something that routes to it.

### Organizing a growing app

Two primitives keep navigation legible as an app grows past a handful of views. Reach for them as
best practice rather than letting an app sprawl:

- **Group top-level views into a left menu (`nav.group`) instead of crowding the top bar with view
  pills.** A flat row of pills stops being scannable after a few entries; `nav.group` collects
  related views (for example a *Reports* group and an *Administration* group) into labeled menu
  sections that render as a left rail. Keep grouping single-level — do not nest groups — and let a
  view's role determine which group it appears in.
- **Consolidate several working surfaces of one subject onto a single view with a `tabs` layout node,
  instead of many near-duplicate views.** When one subject has distinct surfaces (overview /
  members / settings), a `tabs` node organizes them under one view with a `state_key` and
  deep-linkable `route_state`, keeping the nav uncluttered. Caveat: tabs are **visual only** — every
  `data_source` in the view loads when the view opens, regardless of the active tab — so a surface
  whose data is heavy or seldom opened is better as its own route-bound view than as a tab.

## Microcopy

Authored `title` and `description` strings render verbatim to end users. Write product microcopy,
omit descriptions that only narrate configuration, and never duplicate a field between a detail
header meta row and a section.
