# Apply a Candidate

Use after [Author and update](author-and-update.md), or for an explicitly requested upload of an
existing candidate. This is the shared procedure for JSONL and DynamoDB definition deployment.
Storage conversion and deployment repair use [Migrate and repair](migrate-and-repair.md).

## Upload and prepare

1. Read the current `upload-workflow` and `concurrency` contract topics. Confirm the target and
   authority are established and the candidate folder is complete.
2. Build the manifest from the folder. It lists every accepted file with its sha256 (lowercase hex
   over the file's UTF-8 bytes) and size, and reports any excluded file:

   ```bash
   node <skill-dir>/scripts/keeper-app-bundle.mjs manifest <app-folder> > manifest.json
   ```

   Add `--definitions-only` for definition work on an existing app, so local JSONL stays out of
   the upload. A file reported as excluded is either a misplaced app file (fix its path) or a
   local note.
3. Call `app_upload_begin` with the `manifest` array from that output. Fix every reported
   `rejectedPaths` entry or `problems` item in one pass and call it again. The result names the files the server still
   needs; unchanged installed files are reused automatically.
4. When `missing` is not empty, upload exactly those files with the returned capability as one
   JSON body `{"files":[{"path","content"}]}`. Pass the result to the script on standard input
   or as a file; it never prints the upload address. Treat the upload URL
   and headers as secrets: do not repeat, log, or store them beyond this command.

   ```bash
   node <skill-dir>/scripts/keeper-app-bundle.mjs upload <app-folder> - <<'JSON'
   <the app_upload_begin result>
   JSON
   ```

   An expired capability or bundle needs a new `app_upload_begin`, which uploads only what is
   still missing.
5. Call `app_upload_prepare` with the `bundleId`, the intended `mode`, and `dataMode`. For existing
   definition work, use `dataMode: "preserve"` with a `--definitions-only` manifest. Use `replace` for
   a complete definition set, or `merge` for an explicitly partial overlay. Live-data replacement
   requires explicit user intent, app-admin replacement capability, `dataMode: "replace"`, and
   `mode: "replace"`. Prepare validates, diffs, and stages in one call; a successful prepare
   consumes the bundle.
6. Review `validation`, then `added`, `modified`, `deleted`, `unchanged`, and
   `unknownInstalledPaths`. Definition-only changes must not modify or delete JSONL. If a `replace`
   candidate unintentionally drops an installed guide or `notifications.yaml`, restore it in the
   folder and upload again. Retain `uploadId`, `baseRevision`, `candidateRevision`, `expiresAt`,
   and the exact modified/deleted path lists. Keep the folder unchanged until deployment and
   verification complete.

`files` (inline content) remains available on `app_upload_prepare` and `app_diff` for a change of
one or two small files; it is not a way to deploy a whole app.

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

A stage lasts about a day. While waiting for approval, `app_upload_status` reports whether the app
changed since prepare, and `app_upload_renew` extends a stage that is still current. Both work only
under the authorization that prepared the stage. If a stage expires or the revision is stale,
reread the app, rebuild the candidate, and prepare a fresh stage. Present the new material diff and resolve any newly uncovered authorization gap.
Never substitute a current revision into an old stage. Definition-only stages tolerate concurrent
record activity because they pin the definition revision; data-replacement stages pin the full
revision. Call `app_upload_abort` for an unused stage.

After apply, compare the returned revision with the staged `candidateRevision` (`definitionRevision`
for a definition-only stage, `revision` for a data-replacement stage), then confirm the exact
content: pass the apply result, or a later `app_get` result, to
`node <skill-dir>/scripts/keeper-app-bundle.mjs verify <app-folder> -`. It compares every returned
sha256 with the local files and needs no read-back of the installed app. A DynamoDB apply may return `state: "applied"` immediately when the compiled serving
plan is unchanged, including notification-only edits; otherwise it returns a deployment job.
Compare a job result once it completes. If
apply rejects, rolls back, or reports a revision mismatch despite an
unchanged stage, preserve the candidate and classify every path before retrying: `app.yaml` and
descriptor YAML under `schemas/`, `views/`, `workflows/`, and `agents/` are definitions;
`notifications.yaml`, `docs/` and `text_templates/` are installed content, and `data/*.jsonl` is live data. Do not
drop guides, change storage, or replace live data merely to make the revisions agree. Treat a
server-side revision that cannot be explained by the documented scope as a runtime inconsistency
and report the exact revisions and path inventory.

## Complete deployment

- **JSONL:** successful apply returns a launch descriptor. Use [Inspect and open](inspect-and-open.md)
  to present or open it according to the request.
- **DynamoDB:** when apply returns `state: "applied"`, the unchanged serving plan needs no job.
  When it returns `state: "deployment_started"`, use the returned `deploymentJobId` as `jobId`
  in [Job control](jobs.md): `app_job_advance` progresses the job, while `app_job_status` only
  reads telemetry. Call `app_url_get` only after `COMPLETED` for a started job.

For an end-to-end delivery or explicit test request, continue with [Verify and test](verify-and-test.md)
after the installed revision is operational. At minimum, run an installed health check and exercise
the primary create or update path that the change introduced. A successful apply is not behavioral
verification.

Report job diagnostics on failure; do not assume partial work has published. The job-control
workflow owns `app_job_retry` and `app_job_cancel` handling. A changed candidate needs a new
upload and stage. Avoid starting a second job just because the first has not completed.
