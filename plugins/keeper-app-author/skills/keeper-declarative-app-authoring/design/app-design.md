# App Design

Use for new apps and substantial redesigns. For a focused edit, revisit only the choices it affects.
Choose the smallest composition that satisfies the brief, then read its exact syntax. The tables
below are decision aids, not a required reading sequence or a fixed set of app archetypes.

## Records and storage

Use one table per meaningful record kind; model real references with relations rather than copied
record bodies. A separate table is unnecessary for a field that is just a scalar value. Use a
read-only projection when joins or derived output are needed. Logical identity, version history,
and a current snapshot belong together only when the brief needs historical "valid on date"
semantics, not merely an ordinary edit history.

Read [schema](../reference/schema/index.md) for table syntax, [storage](../reference/storage/index.md)
for a new engine choice, and [app security](../reference/security/index.md) for app admission, row
visibility, and writes. Add write, validation, or query policy only when it enforces a required
behavior; avoid speculative indexes and unnecessary workflows.

## Primary interaction of each screen

| User interaction | Useful composition |
| --- | --- |
| Capture and maintain a small flat list | `record_collection` |
| Dense record browsing | `record_table`, with a route-bound detail when needed |
| Compact or card-style browsing | `record_list` |
| Work grouped by a select field | `record_board`; writable source and group field for moves |
| One record with editing/actions and related context | Route-bound `record_detail` |
| Separate create screen | `record_form` |
| Weekly rows-by-days time entry | `timesheet_week_grid` |
| Read-only joined report | `projected_table` and read-only record components |
| Live provider output | Component matching the provider's exact result shape |

Use [components](../reference/views/components/index.md) for the selected types. A view is the
container; a board or detail is a component inside it. Keep operational queues, complex record
workspaces, dashboards, and automation on components suited to those interactions rather than
stretching a small all-in-one collection into them.

A board over a projection may display records read-only, but cannot save moves or enable mutable
board features. Do not infer editability from the visual component. The [board reference](../reference/views/components/record-board.md)
defines that distinction.

When the domain needs per-member settings, keep platform admission in Keeper and add an optional
one-to-one profile referencing `keeper_app_members`. Read [membership and profile
enrichment](../reference/security/membership.md); app flags such as assignment availability must not
become a second membership system. [Issue Tracker](../examples/issue-tracker/README.md) shows the
profile, eligible-assignee picker, and separate project/group grant graph together.

## Layout and navigation

Give primary records stable route-bound workspaces when deep links matter. Hide contextual edit
and detail views from global navigation as appropriate, and provide links with the required route
keys. Organize around the user's task: keep capture and correction in context through dialogs or
inline detail where useful, and use separate screens when they serve a distinct purpose.
[Time Tracker](../examples/time-tracker/README.md) demonstrates this across entry, week and report views.
[Issue Tracker](../examples/issue-tracker/README.md) demonstrates grouped regular work views,
grouped setup views, route-synchronized tabs, and a hidden route-bound detail view.

For a growing app, use `nav.group` to organize top-level views. Use a `tabs` layout for related
surfaces of one subject. Tabs are visual: ordinary eager data sources still load when the view
opens, so heavy or rarely used surfaces may deserve separate views. Explicit manual query actions
have their own deferred-loading rules. Read [navigation](../reference/views/navigation.md),
[layout](../reference/views/layout.md), and the [view envelope](../reference/views/view.md).

## Behavior and user guidance

Choose direct actions, workflows, agents, or compute using [automation](../reference/automation/index.md)
only when the requested behavior needs one. Keep mutations scoped to their actual records.
Use user-facing titles and descriptions; omit configuration narration and avoid displaying the same
field twice in a detail header and section.

Read [user guides](user-guide.md) when the app needs explanations of statuses, approval steps, or
role-specific tasks. Optional [examples](../examples/index.md) illustrate complete compositions;
they do not dictate the number of screens, tables, or features. Check the resulting behavior using
the fitness and validation steps in [Author and update](../workflows/author-and-update.md).
