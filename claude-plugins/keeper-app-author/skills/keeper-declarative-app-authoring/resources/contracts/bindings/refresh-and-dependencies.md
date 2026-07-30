# Refresh And Dependency Contract

Source order is inferred from explicit `depends_on`, `source.*` bindings, projection `from` and
`lookups`, and bindings in table filters or record ids. Script bodies are not scanned; pass every
external value through script `input`.

`refresh_on` accepts `state.*` and `route.*` triggers. Bound state/route values are inferred even
when `refresh_on` is omitted. Refresh propagates through dependencies and dependents. A `refresh`
action may name sources or omit them for all.
`refresh_on` only reloads a source; it does not filter rows. A displayed source must consume each
filter state key in `filter` or projected `where` logic.

Only `provider_resource` may use `poll`; `poll.everySeconds` must be at least five. Poll only live
operational provider data, not ordinary JSONL tables.
