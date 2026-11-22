# `automation_runs` Component

Shows the automation runs on one record, for app admins: each run's automation, status, start time
and AI cost, opening to the path it took, the AI outputs, what each workflow received, and errors,
with Stop and Retry. Place it on a record page next to the record an automation works on, such as
an incoming email that a triage automation files.

```yaml
components:
  email:
    kind: record_detail
    data_source: email
  runs:
    kind: automation_runs
    title: Triage runs
    table: emails
    record_id: {bind: route.emailId}
    automations: [triage_incoming_email]   # optional; default every automation's runs
    empty_message: No automation has run on this email yet.
layout:
  kind: stack
  children:
    - {component: email}
    - {component: runs}
```

Required: `table` (safe identifier) and `record_id`, a bound value from `state`, `route`, `source`
or `context`. Optional: `title` (default "Automation runs"), `automations` (a non-empty list of
automation ids from `automations/<id>.yaml`; only their runs show), and `empty_message`.

- **Admins only.** For anyone else the card renders nothing, as it does for share-link viewers and
  on servers where automations are off. Put it on any page people share; it needs no `access` of
  its own.
- **Empty means hidden:** with no runs and no `empty_message` the card renders nothing, so a
  record page stays quiet until something runs. Set `empty_message` when admins should see that
  nothing ran.
- It lists the record's 20 newest runs. Runs are kept for 90 days.
- While a run is queued or running, the card refreshes every few seconds for up to ten minutes.
- A run that failed, was capped or was stopped offers Retry. When a write may or may not have
  happened, it asks the admin to check the record first: "send it again" reruns the write, "Retry
  without resending" picks up after it.
- A test run ("Test on a record" in the Automations section of the app's Manage page) shows here
  too, marked as a test: its workflows did not run, and each shows what it would have been sent.

Agents do not see this component; authors read runs through the `app_automation_runs` MCP tool.
