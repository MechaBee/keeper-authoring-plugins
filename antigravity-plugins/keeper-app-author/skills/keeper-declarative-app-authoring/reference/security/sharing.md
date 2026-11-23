# View Sharing Reference

Optional top-level `share` controls which state and routes a generated Keeper link may expose:

```yaml
share:
  enabled: true
  route_keys: [itemId]
  state_keys: [statusFilter]
  allowed_audiences: [owner_only, authenticated_link]
  views: [item-detail]
```

`route_keys` is `"*"` or safe keys. `state_keys` is a list of safe keys. Audiences are
`owner_only`, `public_link`, or `authenticated_link`. `views` lists view ids reachable from the
share link; an empty list restricts the link to the current view. Do not expose more route, state,
or destination data than the user-facing share flow requires.

Sharing is disabled when `share` or `share.enabled` is omitted. Omitted route keys expose none,
and omitted audiences allow only `owner_only`. Public or authenticated links therefore require an
explicit view policy.
