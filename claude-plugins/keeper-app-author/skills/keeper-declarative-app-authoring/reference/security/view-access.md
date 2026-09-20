# View Access Reference

Optional top-level `access` limits the app roles that may open a view:

```yaml
view:
  id: administration
  title: Administration
access:
  allowed_roles: [admin]
```

`allowed_roles` is a non-empty array drawn from `viewer`, `editor`, `developer`, and `admin`.
When omitted, the view adds no role restriction. App admins may access every view. Declare this
beside `view`, not inside it. This view property is distinct from the unsupported `app.yaml`
membership property named `access`.

Navigation visibility only changes how a view is reached. Neither a hidden view nor a role-limited
view replaces [row access](row-access.md) or [mutation restrictions](mutations.md) on its tables.
For share-link policy, see [Sharing](sharing.md).
