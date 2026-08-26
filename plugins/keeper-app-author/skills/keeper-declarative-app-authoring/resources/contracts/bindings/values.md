# Binding Value Contract

A standard binding is one object with `bind` and optional primitive `fallback`:

```yaml
bind: state.selectedTaskId
fallback: ""
```

Standard sites allow `state.*`, `route.*`, `source.*`, and `context.*`. Row/card actions and
`record_form.on_success` also allow `record.*`. Provider follow-ups also allow
`action.result.*`. App-agent descriptors use only `input.*`, `result.*`, and `system.nowIso`.
Workflow descriptors use only `input.*`, `step.*`, and the workflow `system.*` bindings
`system.nowIso`, `system.actorUserId`, `system.actorEmail`, `system.appRole`,
`system.workspaceAccessMode`, and `system.workflowId`; the `system.actor*` bindings resolve only
when the workflow runs with an actor (`actor_required: true`).
Binding roots are reserved runtime vocabulary; they are not domain-owned identifiers.

Bindings resolve to primitives. Object/array results become fallback or null except where action
input normalization explicitly permits string arrays. Available context keys are `workspaceId`,
`userId`, `userEmail`, `agentId`, `domain`, `appId`, `viewId`, `browserTimeZone`, and `nowIso`.
`userId` and `userEmail` describe the authenticated actor and are null for anonymous grant
viewers; they are not the backing workspace storage identity.

`record` is reserved: use `bind: record.id`, never `bind: task.id`. Never change that binding to
`bind: lead.id` when adapting an example. Projected `path: task.id` is a different contract and is
valid only when the projection declares `as: task`.
