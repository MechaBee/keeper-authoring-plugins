# Job Control

Use for durable deployment, conversion, and repair jobs. Keep the returned `jobId` and exact
`agentId`, `workspaceId`, and `appId` together. A deployment apply returns `deploymentJobId`;
conversion/repair starts return `job.jobId`. Pass that value as `jobId` to job tools. Access is
checked by the server for the selected operation; do not switch targets to bypass a refusal.

## Progress and observation

`app_job_advance` runs one bounded activation and persists progress. Repeat for the same job while
processing is authorized, observing its returned disposition and state. `app_job_status` is read-only
telemetry and does not advance a job. Report failure diagnostics; stop normal processing on
completion, cancellation, failure, or a user request to stop. A waiting, busy, or paused result
is not completion: inspect its status and honor the indicated wait or blocker rather than starting
duplicate jobs or retrying a healthy job.

## Retry

After the user requests a retry of a diagnosed failed job, call `app_job_retry` with that exact
`jobId`, then advance the returned job. The runtime accepts retry only in `FAILED` state and checks
deployment evidence. If it rejects stale evidence, obtain new preparation through the appropriate
workflow; do not weaken its fence. A changed candidate requires fresh validation and preparation,
not a retry with altered payload.

Receipt-backed app deletion uses `app_delete_retry` and `deletionId` instead; see [Delete](delete.md).

## Cancel or stop processing

Distinguish a request to stop making progress from a request to cancel the job. For a pause in
assistant processing, stop calling advance and report the last known state; this does not cancel
or roll back an accepted operation. For cancellation, call `app_job_cancel` with the exact job ID.
Cancellation is handler-aware: its response may record a request rather than a terminal result.
Use status to inspect it and, when needed, bounded advances to let the handler finish cancellation.
Do not claim `CANCELLED` until the runtime returns that state, or promise reversal of published work.

The runtime rejects cancellation of active `APP_DELETE` jobs after runtime scope revocation.
Terminal jobs are returned unchanged. If cancellation is rejected or processing already completed,
report that result instead of treating the request as success.
