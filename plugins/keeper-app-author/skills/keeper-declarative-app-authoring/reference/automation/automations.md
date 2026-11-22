# Automations

An automation is `automations/<id>.yaml`: a trigger plus steps that run on their own, in the
background, without a person pressing a button. Automations read records, run scripts, ask an AI
to classify, extract or draft, and write only by running [workflows](workflow.md). They never
delete and never send email: they draft, and a person sends.

Admins switch automations on in Manage; `enabled_by_default: true` starts one switched on when the
app is installed. Runs, their steps and their AI cost show in Manage and in the
[automation runs](../views/components/automation-runs.md) component.

```yaml
id: price_request              # must match the file name
title: Price the request
description: Prices a complete request from the rate table and drafts the quote email.
enabled_by_default: true
trigger:
  record:
    table: requests
    operation: update
    fields: [status]           # update only: fire when one of these changed
    when: {test: {bind: trigger.record.status}, op: equals, value: ready_for_pricing}
limits: {max_steps: 20, max_ai_steps: 1, daily_cost_cents: 300}
steps:
  - id: customer
    kind: query_records
    table: customers
    filter: {id: {bind: trigger.record.customer_id, fallback: "-"}}
    limit: 1
  - id: draft
    kind: ai
    tier: smart
    guide: ai/quote.md
    input:
      request: {bind: trigger.record}
      customer: {bind: step.customer}
    output:
      subject: {type: text, max_length: 150, description: "Subject line in the customer's language."}
      text: {type: textarea, max_length: 4000, description: "The email text without signature."}
  - kind: run_workflow
    workflow: set_price
    input:
      request_id: {bind: trigger.record.id}
      quote_subject: {bind: step.draft.subject}
      quote_draft: {bind: step.draft.text}
```

## Descriptor

| Key | Meaning |
| --- | --- |
| `id`, `title` | Required. `id` equals the file name. |
| `description` | What it does, shown in Manage. |
| `trigger` | Exactly one of `record`, `schedule`, `email`, `manual`. |
| `enabled_by_default` | Default false. |
| `sensitive` | AI steps use only model routes whose provider keeps no data. Set it for personal, health or financial content. |
| `limits` | `max_steps` (default 60, ≤ 500, `for_each` items and lanes count), `max_ai_steps` (default 25, ≤ 100), `timeout_s` (default 600, ≤ 3600), `daily_cost_cents` (default 500, ≤ 100000). |
| `on_error` | `{notify: <topic>}`: post failures on a postable [notifications](../application/notifications.md) update topic. |
| `steps` | At least one; at most 150 declared, blocks nested at most 3 deep. Step ids are unique across the whole automation. |

## Triggers

- `record: {table, operation: create|update, fields?, when?}` — after a record is saved. `when`
  reads `trigger.record` and, for updates, `trigger.previous`. An automation's own writes never
  start that same automation again, but they do start other automations, up to three in a chain;
  the deeper ones are skipped. Guard with `fields` and `when` (for example on a status value) so
  each automation fires only on the change it is for.
- `schedule: {cron, timezone, query?}` — five-field cron read in an IANA time zone. With
  `query: {table, where?, sort?, limit}` (limit ≤ 500) there is one run per matching record as
  `trigger.record`; without it, one run per tick.
- `email: {}` — one run per message accepted by the app's Email in address. At most one email
  automation per app. `trigger.message` holds `from.{address,name}`, `to`, `cc`, `reply_to`,
  `subject`, `date`, `text` (cut at 20,000 characters, `text_truncated`), `thread_key` (the
  conversation's root Message-ID), `message_id`, `in_reply_to`, `attachments` (pass them to an AI
  step's `files`), `folder` and `path` (the stored message). The owner creates the address in
  Manage; uploads there run it by hand.
- `manual: {table}` — a "Run <title>" action on a record of `table`; also how to try an automation.

## Bindings

`{bind: <path>, fallback?}`. Roots: `trigger.record.*`, `trigger.previous.*`, `trigger.message.*`,
`step.<id>.*` (a step guaranteed to have run before), `item`, `item.*` and `index` inside
`for_each`, `lane.<lane>.<step>.*` only in a `parallel` block's `outputs`, and `system.nowIso`,
`system.nowLocal`, `system.automationId`, `system.runId`. Validation rejects a path that names a
key the step does not expose.

## Steps

| Kind | Use |
| --- | --- |
| `get_record`, `query_records`, `collect_records`, `script` | As in [workflow steps](steps.md), with bound `record_id`, `filter`, `where` and `input`. `when` guards are not allowed: use `branch`. |
| `ai` | Classify, extract or draft into a typed result. See [AI steps](#ai-steps). |
| `run_workflow` | `{workflow, input, id?}`: the only way to write. Name it with `id` to read the workflow's `result`. |
| `set` | `{values}`. With `id`: named values. Without `id`, directly in a branch case: sets the branch outputs. |
| `notify` | `{topic, record, text?}`: post an update on a postable topic. |
| `assign_team` | `{team, record, message?}`: give a record to an agent team. Does not wait. |
| `start_automation` | `{automation, record}`: start another automation of this app. Does not wait; not itself. |
| `stop` | `{status: done\|skipped, note?}`: end the run. Steps after it in the same list never run. |
| `branch` | `on` + cases with `value`/`values`, or cases with `when` (first match wins); `default`; optional `outputs: {key: text\|textarea\|number\|boolean\|date\|json}` that every path sets with an id-less `set` or ends with `stop`. |
| `parallel` | 2–5 `lanes` run at once; `outputs` bound from `lane.*`; `fail: all\|any`. |
| `for_each` | `{items, max (≤ 100), concurrency (≤ 5), steps, collect?, fail: item\|all}`. More items than `max` fail the step; nothing is cut silently. |

## Writing through workflows

A workflow run by an automation:

- must not delete or replace records, must not contain `send_email`, and must not be an AI task's
  commit workflow;
- receives every input it requires, and no input it does not declare;
- writes only tables whose [mutation policy](../security/mutations.md) admits the automation:

  ```yaml
  mutationPolicy:
    allowedRoles: [editor, admin]
    channels:
      workflow: {operations: [update], workflowIds: [change_email_kind]}   # people's buttons
      automation:
        operations: [create, update]
        automationIds: [read_incoming_mail]
  ```

  A table that names an automation the app does not define fails verification.

## AI steps

```yaml
- id: read
  kind: ai
  tier: fast                    # fast or smart; the platform picks the model
  guide: ai/read.md             # or a short `instruction`
  memory: true                  # include the app's memory text
  input: {subject: {bind: trigger.message.subject}, text: {bind: trigger.message.text}}
  files: {bind: trigger.message.attachments}   # PDFs and images, read natively
  output:
    kind: {type: option, options: [quote_request, booking, other]}
    company: {type: text, optional: true, max_length: 200}
    pieces:
      type: many
      max_items: 30
      fields:
        count: {type: number, min: 0, description: "0 when the mail does not say."}
        stackable: {type: option, options: [yes, no, unknown]}
```

The step never writes; bind its output into a `run_workflow`. Output types: `text`, `textarea`
(`max_length` ≤ 20000), `number` (`min`, `max`), `boolean`, `date`, `option` and `options`
(`options` as values or `{value, label}`), and `many` (`fields`, `max_items` default 50, ≤ 200; no
`many` inside `many`). Write a `description` for every field whose meaning is not obvious from its
name: it becomes the field's description in the model's output schema.

### Output size limits

The output becomes a structured-output schema, and the model provider rejects schemas that are too
large or too complex. Validation enforces what it can:

- At most 30 output fields at the top level.
- At most **24 optional fields**, counting those inside `many` items. Optional `text`, `textarea`
  and `date` fields do not count: they are sent as required strings, and an empty string is stored
  as null.

Validation cannot see the provider's separate complexity limit ("Schema is too complex"), which
optional fields inside `many` items reach quickly. A schema can also be accepted yet make the
model loop until it runs out of tokens, which costs money on every retry. Keep outputs small and
flat:

- Inside `many` items, make numbers required and say what stands for "not given", such as
  `min: 0` with "0 when the mail does not say." Turn that 0 back into empty in a script step.
- Use an `option` such as `[yes, no, unknown]` instead of an optional `boolean`.
- Split one large extraction into two AI steps, or a classifying step and a `branch`, rather than
  one output with dozens of fields.
- Test with `app_automation_test` or a manual run on real input before switching the automation
  on, and read the run's AI step output and cost.
