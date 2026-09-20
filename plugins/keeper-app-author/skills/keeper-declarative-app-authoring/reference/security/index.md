# App Security

Read this when creating a team app or changing access, writes, or sharing. Determine who can enter
the app, which rows they may reach, and which operations they may perform. These are separate
controls with different declaration locations.

| Control | Location | Reference |
| --- | --- | --- |
| App admission, roles, and optional member profiles | Keeper control plane plus app-owned enrichment | [Membership](membership.md) |
| Row visibility and owner/resource scope | Schema `rowAccess` | [Row access](row-access.md) |
| Write roles, channels and lifecycle gates | Schema `mutationPolicy` | [Mutations](mutations.md) |
| Role-specific screens | View top-level `access.allowed_roles` | [View access](view-access.md) |
| Share-link audience and exposed route/state | View top-level `share` | [Sharing](sharing.md) |

## Choose row scope from the brief

- `all`: all admitted app users may read these rows, subject to their effective access. This is
  not public access and does not grant app membership.
- `owner`: ordinary members need access to their own rows; use the runtime-stamped owner field.
  Appropriate for personal drafts or submissions when the requested visibility is personal.
- `policy`: rows are assigned to principals or groups, or derive scope from already authorized
  resources. Grant and group-membership tables must themselves be admin-only.

New team schemas use version 2 and explicit `rowAccess`. Do not infer that all hours or expenses
must be private: choose the requested visibility. Owner and resource policies include documented
admin behavior; shared-link sessions do not inherit an unrestricted admin bypass.

## Add write restrictions when they change behavior

Use `mutationPolicy` when writes need narrower roles than reads, only approved workflows may write,
or editability depends on another record's lifecycle. Omit a policy that adds no restriction. Use
[validation](../schema/validation.md) for data integrity and [constraints](../schema/constraints.md)
for atomic grouped bounds; they do not grant access.

View filters, hidden navigation, readonly controls, and client-side expressions cannot replace
row authorization. A role-specific view limits that screen; protect its underlying records and
write paths separately. Share only the audience, routes, state, and destinations required by the brief.

## Author within effective authority

Inspect `effectiveAccess` from `app_get`; do not infer capabilities from a role label alone.
Workspace access can limit a role. A developer can edit definitions and has editor runtime
behavior, but cannot read raw data, replace it, manage membership, weaken existing row policy, or
add an unrestricted table. Raw-data or policy work requires the corresponding admin capability
and user intent. Use [Migrate and repair](../../workflows/migrate-and-repair.md) for authorization
migrations, including a complete security-metadata graph in the candidate when required.

When checking a changed policy, verify the intended ordinary user and admin paths, plus the shared
session path if sharing is involved. Do not broaden permissions just to bypass a validation or
access error.

For a worked app combining these controls, see the [Time Tracker security reading path](../../examples/time-tracker/README.md#security-and-data-integrity).
