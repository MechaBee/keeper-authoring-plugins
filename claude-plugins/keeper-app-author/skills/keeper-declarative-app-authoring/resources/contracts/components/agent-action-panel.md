# `agent_action_panel` Component

```yaml
kind: agent_action_panel
title: Draft summary
agent: draft-summary
input:
  task_id: {bind: state.selectedTaskId}
submit_label: Generate
required_state_keys: [selectedTaskId]
```

Required: existing app-agent id in `agent`. Optional: `title`, `description`, bound `input`,
`submit_label`, and `required_state_keys`. Use this component instead of hand-authoring a
`run_agent` provider action. Input keys and values must match the agent descriptor.
