# `record_collection` Component

Use when one small surface should own browse, search, selection, create, delete, and embedded detail.
Do not use it as the default for a lifecycle queue or complex primary business record.

Required keys are `table` and table-shaped `data_source`. Optional common keys are `title`,
`show_title`, `description`, `empty_message`, and:

- `search`: `enabled`, `placeholder`, `fields`.
- `create`: action-set `data_source`, optional `label`, `mode: form|instant`.
- `delete`: `enabled`, `label`, `confirm`, `mode: block|cascade`.
- `ordering`: schema `field`, optional positive `step`, `label`.
- `pinning`: `enabled`, boolean `field`, optional datetime `pinned_at_field`.
- `archiving`: `enabled`, boolean `field`, optional `toggle_label`.
- `selection`: optional `state_key`, `desktop: split` (the default; `overlay` is deprecated and now
  renders as split — the detail dialog was removed), `mobile: page`,
  `reconcile: none|first_available|clear`, and `reset_state`.
- `summary`: optional `default_view`, title/preview/badge/color fields, meta fields, and `views`.
- `detail`: the `record_detail` presentation contract without `kind`, `table`, or `data_source`.

Summary views require `id` and `kind: list|grid`; optional presentation fields must exist. A
`color_field` names a `color` schema field. Capture apps commonly use `create.mode: instant`,
`detail.save_mode: autosave`, `detail.presentation: document`, a markdown content field, and a list
or grid summary with pin/archive. Do **not** re-declare pin/archive/color/delete as detail fields: on
the document surface they render as a derived affordance bar from the collection's `pinning`,
`archiving`, `summary.color_field`, and `delete` config. Back-office surfaces keep the default `form`
presentation with form creation and explicit save.

With `projected_table`, the collection is read-only: omit create/delete/ordering/pinning and detail
actions, and set embedded detail to read-only. Read [`record-detail.md`](record-detail.md) for the
full nested detail field contract. The complete `hello-notes/` example demonstrates a capture app.
