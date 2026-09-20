# Row Access Reference

Declared as `rowAccess` on a table schema. Version 2 requires it.

Use `rowAccess: { mode: all }` for team-wide rows. Use the following elementary owner policy when
members must see and mutate only their own rows:

```yaml
rowAccess:
  mode: owner
  ownerField: owner_user_id
```

The owner field must be an existing required, readonly `text` field or a reference to the runtime
`keeper_principals` table, and cannot be the primary key. Keeper stamps it from the authenticated
stable user ID. Views and caller filters may narrow row scope but never widen it. App admins and
workspace managers see all rows. Version 1 schemas without `rowAccess` retain legacy `all`
behavior with a validation warning.

## Resource-grant policy

Use `mode: policy` for resource assignments, derived resource scope, or admin-only security
metadata as shown below. The runtime evaluates every `allOf` entry; authors may not add expressions, scripts,
request bindings, email addresses, or another caller-controlled identity.

```yaml
rowAccess:
  mode: policy
  allOf:
    - kind: resource_grant
      resourceField: resource_id
      directGrants:
        table: resource_user_access
        resourceField: resource_id
        principalField: principal_id
      groupGrants:
        table: resource_group_access
        resourceField: resource_id
        groupField: group_id
      groupMemberships:
        table: group_memberships
        groupField: group_id
        principalField: principal_id
    - kind: owner
      ownerField: owner_user_id
      adminCreateAssignment: resolved_principal
```

`resource_grant` permits a direct assignment for the authenticated principal or an assignment for
one of their groups. Each entry in `allOf` is conjunctive, so the optional `owner` requirement
also applies and is stamped/immutable. An owner clause may use
`adminCreateAssignment: resolved_principal` only when its owner field is a required readonly
`keeper_principals` reference. It lets an unrestricted app admin select a resolved principal while
creating a row; an absent selection is stamped to the administrator, unresolved selections fail,
and all updates preserve the existing owner. The declaration is unavailable for `mode: owner` and
never applies to shared-link sessions. Use `related_resource_grant` only to derive
scope from rows already authorized in another table; do not maintain a client-side projection to
broaden access:

```yaml
    - kind: related_resource_grant
      resourceTable: projects
      resourceField: id
      targetField: project_id
```

This permits a row only when its `targetField` equals the authorized resource row's
`resourceField`; the resource table must already have a valid row policy.

Every table named by `directGrants`, `groupGrants`, or `groupMemberships` is security metadata and
must itself be admin-only:

```yaml
rowAccess:
  mode: policy
  allOf:
    - kind: app_role
      anyOf: [admin]
```

Keeper verifies all referenced tables and scalar fields, rejects policy cycles, and compiles the
required DynamoDB paths. A grant or membership change invalidates a protected cursor and fences a
subsequent write. App admins may bypass row policy only after normal app/workspace admission;
shared-link sessions do not inherit that bypass.
