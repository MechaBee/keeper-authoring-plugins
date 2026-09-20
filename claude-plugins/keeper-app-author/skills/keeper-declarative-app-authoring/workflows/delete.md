# Delete an App

Use only for an explicit request to permanently delete an app or resume its deletion. Archiving
is different: setting manifest `status: archived` uses [Author and update](author-and-update.md).
Removing a view or record is not permission to delete its app.

## Resolve scope and authority

Use [Inspect and open](inspect-and-open.md) to identify the exact agent, workspace, and app. Inspect
metadata and effective workspace access before deletion. Only workspace `owner` or `manage` mode
can permanently delete; an app-admin role alone is insufficient. Describe the exact app and the
loss of its definitions, records, and usable share links before starting. Resolve any ambiguity or
missing authorization for that permanent effect. Existing explicit authorization for the exact
deletion need not be requested again.

There is no deletion prepare/diff tool. Do not invent an upload stage for deletion. Call
`app_delete` with the selected target and `confirmationAppId` exactly equal to `appId` only once
the permanent operation is authorized.

## Finish the returned operation

- If the result is `state: deleted`, report completion. JSONL deletion revokes active target
  share grants and removes the app folder synchronously. A DynamoDB app with no initialized
  storage or remaining runtime artifacts can also return immediate completion.
- If the result is `state: deletion_started`, retain `operation.deletionId` and the exact
  `operation.job.jobId`. Advance that job with `app_job_advance` while cleanup remains authorized.
  Read receipt-backed progress using `app_delete_status` with `deletionId`; status reads do not
  advance cleanup. Claim completion only when the operation reports `state: deleted`.

If the response is uncertain, inspect the known receipt rather than initiating unrelated cleanup.
Keep the receipt ID even when the app disappears from ordinary app discovery. On a failed or
prepared operation, inspect diagnostics and available actions; when the user requests resumption,
call `app_delete_retry` with the same `deletionId`. This can enqueue a missing job or retry its
failed job from the durable checkpoint. Continue with its returned exact job and deletion status.

Active deletion jobs cannot be cancelled after runtime scope has been revoked. A request to stop
assistant processing stops further advances; it does not restore the app or undo deletion. Report
remaining cleanup and the receipt so it can be resumed. Never manually delete storage keys,
receipts, or registry records to force a job to finish.
