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
  `stepping`, `reconcile: none|first_available|clear`, and `reset_state`.
- `summary`: optional `default_view`, title/preview/badge/color fields, meta fields, and `views`.
- `detail`: the `record_detail` presentation syntax without `kind`, `table`, or `data_source`.

On desktop the list and its detail/create surface sit side by side only when the collection itself
is at least 42rem wide; in a narrower place, such as the side column of a `split` layout, the
surface stacks under the list.

`selection.stepping: true` adds previous/next controls to the detail header, left/right keyboard
navigation, and horizontal touch swipes. It follows the collection's current order after pinning,
archiving, search, and sort; it does not wrap at either end. This option is collection-only and is
not available on `record_board`.

Summary views require `id` and `kind: list|grid`; they may override `label`, `title_field`,
`preview_field`, `badge_field`, `meta_fields`, and `preview_lines` (1–10). The summary-level versions
provide defaults for views that omit them. All referenced presentation fields must exist. A
`color_field` names a `color` schema field. Capture apps commonly use `create.mode: instant`,
`detail.save_mode: autosave`, `detail.presentation: document`, a markdown content field, and a list
or grid summary with pin/archive. Do **not** re-declare pin/archive/color/delete as detail fields: on
the document surface they render as a derived affordance bar from the collection's `pinning`,
`archiving`, `summary.color_field`, and `delete` config. Back-office surfaces keep the default `form`
presentation with form creation and explicit save.

With `projected_table`, the collection is read-only: omit create/delete/ordering/pinning and detail
actions, and set embedded detail to read-only. Read [`record-detail.md`](record-detail.md) for the
full nested detail field syntax. The complete `hello-notes/` example demonstrates a capture app.
