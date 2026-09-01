# View Navigation Contract

Top-level `nav` controls global navigation:

```yaml
nav:
  visible: false
  title: Optional alternate label
  order: 20
  icon: clock             # optional lucide name for the menu entry / icon rail
  group: admin            # optional — buckets this view in the left menu
  preserve_route_keys: [tenantId]
```

`nav.icon` is a lucide name shown beside the label in the left menu and alone when the menu
collapses to its icon rail. Set it on every menu-mode view so the icon rail reads cleanly; an unset
view falls back to a letter monogram there.

All keys are optional. `visible: false` hides a contextual destination. Omitting `nav`, or omitting
`visible`, leaves the view visible. Never use `view.nav` or `view.show_in_nav`; the runtime ignores
both shapes.
`preserve_route_keys` is `"*"` or a list of safe route keys.

## Grouped left menu

By default visible peers render as a flat pill switcher. The moment **any** visible view declares a
`nav.group`, the app switches to a responsive left menu (a mobile drawer on small screens): ungrouped
views sit at the top and each group is a collapsible submenu. The framework owns the switcher — do
not build navigation into a component.

`nav.group` is a group id (a safe identifier, humanized for the label) or an object with display
overrides:

```yaml
nav:
  order: 45
  group:
    id: admin
    label: Administration   # optional; defaults to the humanized id
    icon: shield            # optional lucide name
    order: 90               # optional; orders the group among its peers
```

Members of a group share its id. Group order is the explicit `group.order` if any member sets one,
otherwise the smallest member `order`; item order within a group follows each member's `nav.order`.
Group visibility is derived: a group appears only when the viewer can open at least one of its
members, so per-view `access.allowed_roles` already gates the menu — an admin-only group simply does
not render for other roles. Keep it to a single level of grouping.

Use the framework view switcher for ordinary visible peers. Use a toolbar `link` or a `navigate`
component action for a hidden destination or contextual jump. Contextual actions must pass required
ids explicitly:

```yaml
- type: navigate
  viewId: item-detail
  query:
    itemId:
      bind: record.id
```

Navigation replaces route params with the supplied query plus `workspaceId`; unrelated params are
not preserved automatically. `null` and empty strings are omitted, while `0` and `false` remain.
The destination view must bind the query through `route_state` or directly through `route.*`.

A queryless toolbar link to a visible peer duplicates global navigation and produces a warning.
A queryless link to a hidden Add/Create destination is permitted when it is the only way to reach
that screen.
