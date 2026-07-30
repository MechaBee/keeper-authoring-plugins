# Orchestrator Provider Catalog

Use only for live orchestrator operational views. Do not adapt these names into plausible new
resources or actions.

| Resource | Typical component |
| --- | --- |
| `workspace_team_bindings`, `bootstrap` | record table/detail |
| `binding_agents` | record list/table |
| `agent_maintenance_actions`, `team_primary_actions` | action bar |
| `overview` | stats grid |
| `work_items`, `approvals`, `human_inbox`, `my_inbox_threads` | record table |
| `work_item`, `work_report`, `my_inbox_thread_current` | record detail |
| `work_timeline`, `my_inbox_thread_timeline` | timeline panel |
| `inbox_thread` | inbox thread panel |
| `thread_reply_actions`, `work_interventions` | action bar |
| `schedules`, `schedule_runs` | record table |
| `schedule` | record detail |
| `schedule_primary_actions`, `selected_schedule_actions` | action bar |
| `agent_hierarchy` | tree panel |

Documented manual actions: `send_team_message`, `update_binding_agent`, `create_schedule`,
`pause_schedule`, `resume_schedule`, `cancel_schedule`, `submit_user_message`,
`approval_decision`, `cancel_work`, `reassign_work`, `reroute_work`, `retry_work`,
`manual_escalation`, `exhaust_escalation`, and `reply_human_interaction`.

Prefer generated action-set resources because they provide labels, confirmations, input schemas,
defaults, and permission-aware disabled states. When one source depends on another, bind through
`source.*` and state `depends_on` explicitly.
