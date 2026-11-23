# Pattern: AI Task

The whole shape of an inline AI task that drafts a new copy version in a review app. Read
[AI task](../../reference/automation/task.md) for the grammar.

```yaml
# agents/draft_copy_revision.yaml
id: draft_copy_revision
title: Draft revision with AI
kind: task
input:
  - {id: version_id, type: reference, label: Version, referenceTable: creative_versions, required: true}
target: {table: creative_versions, id: {bind: input.version_id}}
context:
  version:  {kind: record, table: creative_versions, id: {bind: input.version_id}}
  comments: {kind: table, table: review_comments, filter: {version_id: {bind: input.version_id}, status: open}, limit: 50}
guide: ai/draft-copy-revision.md
executor: {kind: inline}
output:
  records:
    version: {table: creative_versions, fields: [headline, body, cta]}
commit: {mode: on_result, workflow: commit_ai_copy_revision}
limits: {timeout_s: 120}
```

```markdown
<!-- ai/draft-copy-revision.md -->
Revise the copy of this creative. Address every open review comment. Keep the brand voice of the
current version. Headlines stay under 60 characters. Never invent prices, dates or claims.
```

```yaml
# workflows/commit_ai_copy_revision.yaml
id: commit_ai_copy_revision
title: Save AI revision
agent_commit: {task: draft_copy_revision}
input_fields: []
steps:
  - {id: base, kind: get_record, table: creative_versions, record_id: {bind: system.agentRun.input.version_id}}
  - id: version
    kind: create_record
    table: creative_versions
    values_from: {bind: result.version}
    values:
      creative_id: {bind: step.base.creative_id}
      author_kind: ai
      agent_run_id: {bind: system.agentRun.id}
result: {step: version}
```

```yaml
# schemas/creative_versions.yaml (excerpt)
mutationPolicy:
  channels:
    direct: {operations: [update]}
    agent: {operations: [create], taskIds: [draft_copy_revision]}
```

```yaml
# views/version.yaml (excerpt)
data_sources:
  ai_revision:
    kind: provider_resource
    provider: workspace
    resource: agent_task_action
    params: {task_id: draft_copy_revision, input__version_id: {bind: route.version_id}}
components:
  ai_runs: {kind: agent_task_runs, table: creative_versions, record_id: {bind: route.version_id}}
```

List the `ai_revision` action set in the view's `actions` without a `placement`, so it joins the
view bar's AI control, and put `ai_runs` beside the version detail. `author_kind` and `agent_run_id` are ordinary app
fields; show `author_kind` so reviewers can tell AI versions apart. The guide says how to do the job
and never restates the output fields.
