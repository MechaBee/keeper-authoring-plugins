# Apply a Candidate

Use after [Author and update](author-and-update.md), or for an explicitly requested upload of an
existing candidate. This is the shared procedure for JSONL and DynamoDB definition deployment.
Storage conversion and deployment repair use [Migrate and repair](migrate-and-repair.md).

## Diff and prepare

1. Read the current `upload-workflow` and `concurrency` contract topics. Verify the candidate has
   passed `app_validate` and the selected target and authority are established.
2. Call `app_diff` with the intended `mode` and `dataMode`. For existing definition work, use
   `dataMode: "preserve"` and omit JSONL. Use `replace` for a complete definition set, or `merge`
   for an explicitly partial overlay. Live-data replacement requires explicit user intent,
   app-admin replacement capability, `dataMode: "replace"`, and `mode: "replace"`.
3. Review `added`, `modified`, `deleted`, `unchanged`, and `unknownInstalledPaths`. Definition-only
   changes must not modify or delete JSONL. If a `replace` candidate unintentionally drops an
   installed guide, carry the guide forward and rebuild the candidate.
4. Call `app_upload_prepare` when the user requested a workspace change. Preparation validates and
   stages the candidate without changing the installed app. Retain `uploadId`, `baseRevision`,
   `candidateRevision`, `expiresAt`, and the exact modified/deleted path lists.

## Review and apply

Present the prepared material diff, including additions, modifications, deletions, unknown paths,
and any data impact. Apply only within the user's authorization for that change. Existing explicit
authorization remains valid when it covers the prepared result; ask for missing approval when
the diff exposes a material effect beyond it. Do not request authorization for a hypothetical
change before preparing the reviewable result.

Call `app_upload_apply` with the exact stage and:

```text
expectedRevision = baseRevision
acknowledgedDestructivePaths = sorted(modified + deleted)
```

Acknowledge every modified or deleted path and no others. Added files do not require destructive
acknowledgement. Stages are signed and bound to the exact OAuth authorization; never edit one,
transfer it between workspaces, or reuse it under another authorization.

If a stage expires or the revision is stale, reread the app, rebuild the candidate, and prepare a
fresh stage. Present the new material diff and resolve any newly uncovered authorization gap.
Never substitute a current revision into an old stage. Definition-only stages tolerate concurrent
record activity because they pin the definition revision; data-replacement stages pin the full
revision. Call `app_upload_abort` for an unused stage.

## Complete deployment

- **JSONL:** successful apply returns a launch descriptor. Use [Inspect and open](inspect-and-open.md)
  to present or open it according to the request.
- **DynamoDB:** apply accepts a durable job for the exact compiled target. Use the returned
  `deploymentJobId` as `jobId` in [Job control](jobs.md): `app_job_advance` progresses the job,
  while `app_job_status` only reads telemetry. Call `app_url_get` only after `COMPLETED`.

Report job diagnostics on failure; do not assume partial work has published. The job-control
workflow owns `app_job_retry` and `app_job_cancel` handling. A changed candidate needs a new
validation, diff, and stage. Avoid starting a second job just because the first has not completed.
