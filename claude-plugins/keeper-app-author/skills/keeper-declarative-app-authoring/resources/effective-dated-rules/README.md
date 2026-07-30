# Effective-dated Rules

Use this focused example for logical records whose values change through dated successor versions.
It extracts the reusable lifecycle ideas from a much larger pricing application without carrying
over that app’s domain, scripts, or data volume.

Read every descriptor and seed file before adapting it. All records are fabricated.

```text
effective-dated-rules/
  app.yaml
  schemas/rules.yaml
  schemas/rule_versions.yaml
  schemas/current_rules.yaml
  data/rules.jsonl
  data/rule_versions.jsonl
  data/current_rules.jsonl
  views/rules.yaml
  workflows/create_rule.yaml
  workflows/create_successor_rule.yaml
  workflows/end_rule.yaml
  workflows/reconcile_rule_today.yaml
```

The three-table model is intentional:

- `rules` gives each concept one stable identity.
- `rule_versions` is the immutable-looking effective-dated history.
- `current_rules` is a small materialized read model keyed by the logical rule id.

The workflows demonstrate generated ids from `create_record`, `values_from`, conditional `when`
steps, successor validation, current-snapshot promotion, and conditional `delete_record`.

Preserve these invariants:

- A successor starts after the current version and does not overlap it.
- The previous version is end-dated before the successor becomes effective.
- A future successor is stored in history but does not replace today’s snapshot early.
- The reconcile workflow promotes a now-effective successor or removes an expired snapshot; run it
  from the view when a scheduled boundary passes, or adapt it to an authorized scheduler.
- The logical record and current snapshot reference an actual version.
- Ending a rule deletes its current snapshot only after it is no longer current.
- User-facing workflows preview their scope and mutate only the selected lifecycle.

Do not use effective dating for ordinary audit timestamps. Use it only when the business meaning of
“which value was valid on this date?” matters.
