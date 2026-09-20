# App Membership And Member Profiles

App membership is mutable Keeper control-plane state. Do not include `access`, user lists, or role
assignments in `app.yaml`. New apps have no explicit members; workspace owners and collaborators
with workspace `manage` mode are implicit app admins and do not need redundant invitations.

App administrators manage membership from the host-owned **Access & sharing** surface. When an app
uses grouped navigation, the runtime also adds **Administration → Members** to the left menu. Apps
do not need to define a people view, membership schema, or access action to get these controls.

| Effective app role | Ordinary capabilities |
| --- | --- |
| `none` | No app access |
| `viewer` | Read policy-visible records |
| `editor` | Read and mutate policy-visible records, subject to write restrictions |
| `developer` | Editor behavior plus read/edit/deploy definitions |
| `admin` | Definition, membership, data-policy, and authorized raw-data administration |

Use the returned `effectiveAccess.capabilities` for decisions. Workspace `read` mode limits
non-`none` membership to viewing; workspace `owner` and `manage` confer implicit admin authority.
Runtime record access and raw JSONL access are different capabilities. Being able to edit a record
in a view does not authorize downloading or replacing the app's live data.

## Runtime member directory

Use the runtime-owned `keeper_app_members` table whenever a reference means "an active member of
this app", including assignees, project grants, and group membership. It needs no schema or JSONL
file. Its rows contain:

- `id` and `principal_id`: the stable Keeper principal id;
- `display_name`: presentation text;
- `role`: `viewer`, `editor`, `developer`, or `admin`;
- `membership_source`: `explicit`, `workspace_owner`, `workspace_manager`, or `app_default`;
- `email`: visible only to app access managers.

Only active, resolved principals appear. A pending email invitation is intentionally absent until
it resolves to a stable principal, so it cannot be stored prematurely as an assignee or grant.
References to former members remain valid after access is removed; membership controls admission,
not historical record identity.

`keeper_principals` is the restricted global identity projection. Use it for audit fields such as
`created_by` when a record may refer to somebody outside the app's current membership. Do not use it
for a picker whose meaning is specifically "one of this app's members."

## Optional app-owned profile enrichment

An app may need settings that Keeper membership does not own: a reporting alias, team label,
capacity, notification preference, or an "available for assignment" flag. Model those as an
ordinary app-owned profile table linked one-to-one to `keeper_app_members`:

```yaml
table: member_profiles
version: 2
primaryKey: id
idPrefix: member_profile
displayField: display_name
rowAccess: {mode: all}
mutationPolicy:
  allowedRoles: [admin]
validationPolicy:
  unique:
    - fields: [user_id]
      message: This app member already has a profile.
fields:
  - {id: id, type: text, label: ID, required: true, readonly: true}
  - {id: user_id, type: reference, label: App member, referenceTable: keeper_app_members, required: true}
  - {id: display_name, type: text, label: Display name, required: true}
  - {id: can_be_assigned, type: boolean, label: Available for assignment, required: true, default: true}
```

The profile is optional business metadata, never the source of app access:

- Create it only after the principal appears in `keeper_app_members`.
- Keep the principal id in `user_id` and enforce one profile per principal with a unique constraint.
- Let app-specific flags affect only their named behavior. For example, `can_be_assigned: false`
  removes a person from new assignee choices without removing app access or historical assignments.
- Removing app access must not delete or deactivate the profile. Deleting or disabling a profile
  must not revoke app access.
- Use `keeper_app_members` directly for grants and group membership. Use the profile table for a
  picker only when the choice genuinely requires profile metadata or an app-specific eligibility
  filter.

Profile creation is normally an admin-only `record_form` whose `user_id` references
`keeper_app_members`. The platform does not auto-create app profiles, and pending invitations do
not have a principal id from which one could be created. The [Issue Tracker
example](../../examples/issue-tracker/README.md) demonstrates this separation with an
issue-specific **Available for assignment** flag, plus direct app-member references for project
and group grants.

## Membership actions and compatibility

Most apps should rely on **Access & sharing**. If an admin-only app view genuinely needs a
contextual grant/remove button, the workspace `app_member_access_action` resource accepts a stable
`principal_id` from `keeper_app_members`; it changes control-plane membership and does not mutate
app data. Read the [workspace provider](../views/providers/workspace.md) before using it.

The older profile-coupled form remains runtime-compatible: passing `profile_id` synchronizes a
profile row's `active` presentation field. It is deprecated and must not be used in new apps.
Existing apps can keep it while they are migrated.

Membership is persisted by stable principal id in `keeper_app_access/v2`. Legacy v1 email-only
documents remain readable and upgrade on their next write. Membership changes emit platform
lifecycle events: `app.member.added`, `app.member.removed`, `app.member.role_changed`, and
`app.member.invitation_pending`. Event identity is the platform principal when one exists; app-owned
profile ids are never membership identity.

Membership changes do not change definition revisions or require redeployment. Schema row-policy
changes do affect definitions and may require deployment work. See [row access](row-access.md).
