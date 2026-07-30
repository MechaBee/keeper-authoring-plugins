# Component Action Index

Component action arrays preserve order and may contain only these action types:

- [`set-state.md`](set-state.md) — assign a primitive/bound value to view state.
- [`navigate.md`](navigate.md) — open a view with an optional query.
- [`refresh.md`](refresh.md) — refresh selected or all data sources.
- [`provider-action.md`](provider-action.md) — run a documented provider mutation with follow-ups.

Row/card clicks and `record_form.on_success` add the reserved `record.*` binding root. Provider
follow-ups add `action.result.*`. Never invent an action `type`.

Every top-level `actions[].data_source` must name a data-source key resolving to an action set. A
component id with the same spelling does not satisfy the reference.
