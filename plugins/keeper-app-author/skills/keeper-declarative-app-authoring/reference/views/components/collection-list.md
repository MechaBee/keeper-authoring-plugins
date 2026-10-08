# `collection_list` Component

```yaml
kind: collection_list
title: Collections            # optional
data_source: collections      # a table source over the collection-role table
selection: {state_key: collection_id}
create: true                  # optional; default true. Keeper still checks permissions
empty_message: No collections yet.   # optional
```

The app's [collections](../../schema/roles.md), by name, with archived ones hidden. Choosing one
sets `state_key`; pair it with a [`collection_view`](collection-view.md) whose source binds that
state. **New collection** opens the collection dialog: name, description, a new folder or an
existing one under `docs/<app id>/`, document fields and features.

The source is an ordinary `table` source, so it may filter, for example to keep records' own
collections out of a library (`filter: {in_library: true}` on an app field).
