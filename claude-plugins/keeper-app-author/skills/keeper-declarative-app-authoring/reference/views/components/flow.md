# `flow` Component

A flow page gives one guided flow the whole content area: a step rail at the side, one step at a
time, Review, and a done screen that fills the page. Use it for a job someone opens the app to do,
such as "Add a scenario" or "Delegate to the Tester". Keep the dialog for quick actions in the
context of a record.

```yaml
# views/delegate.yaml
view:
  id: delegate
  title: Delegate to the Tester
  description: Hand a queued task to the Tester, or make a new one from ready scenarios.
nav:
  group: {id: work_with, label: Work with, order: 1}
  order: 3
state:
  task_id: null
route_state:
  task_id: {route: taskId, mode: sync}
data_sources:
  delegate_action:
    kind: provider_resource
    provider: workspace
    resource: workflow_action
    params:
      workflow_id: assign_test_task
      label: Hand to the Tester
      input__task_id: {bind: state.task_id}   # a preset from the URL
      input__assignee_kind: agent
    action_dialog:
      layout: steps
      hidden_inputs: [assignee_kind]
      done:
        title: The Tester has started
        message: You'll get a notice in your inbox when it finishes.
        links:
          - {label: Open the task, viewId: task, query: {taskId: {bind: action.result.id}}}
components:
  flow:
    kind: flow
    data_source: delegate_action
layout:
  component: flow
```

Required: `data_source`, a workspace `workflow_action` source with `action_dialog.layout: steps`.
Optional: `empty_message`, shown when the source has no action. Everything else is the source's,
read exactly as the [step-by-step dialog](../providers/workspace.md#step-by-step-dialogs-action_dialoglayout-steps)
reads it: sections, `hidden_inputs`, presets, `done`, `on_success` and the hand-over line.

- The page's heading is the view's `title`, and under it the view's `description` (else the
  action's `description` param).
- A view holds one flow, beside `markdown_panel` intros only. Any other component is an error: a
  flow page is about one job.
- **Presets from a link:** map a URL key to state with `route_state` and bind it to an input,
  as `input__task_id` above. A done link, a [flow card](toolbar.md#flow-cards) or a row's navigate
  to `delegate?taskId=…` then opens the flow already filled in.
- **The step is in the URL** as `?flowStep=<section id>` (`review` for Review; the first step has
  none), so browser Back and Forward move between steps and a refresh keeps the step. A link to a
  step that isn't reachable yet opens the first step still missing something. `flowStep` is reserved
  on every view: a `route_state` route named `flowStep` is an error.
- **Drafts:** what someone enters is kept in the browser tab until it is saved or they choose Start
  over, so a refresh or a look at another view keeps it. A draft is dropped when the page opens with
  other presets. Closing the tab with unsaved input asks first.
- When the action is disabled (role, or the team can't start), the page shows the reason in place
  of the form. After the save, the done screen offers "Start again" besides its links.
- A [flow card](toolbar.md#flow-cards) `link` to the page shows its steps and hand-over line.
- Agents are not affected: they see the workflow as one action with all its inputs, and flow pages
  are not views shared with agents.
