# Verify and Test

Use after deployment, or when the user asks whether an installed app satisfies a brief. This
workflow checks observable behavior. It complements candidate and installed `app_validate`; it does
not replace them.

## Establish the test scope

Resolve the exact installed target through [Inspect and open](inspect-and-open.md). Read `app_get`
and record the installed definition revision, effective role, and relevant capabilities. For a
newly deployed candidate, confirm that revision matches the apply result before testing.

Build the smallest useful acceptance matrix from the brief and the changed definitions. Include:

- required fields, references, visibility, and lifecycle transitions;
- primary create, edit, navigation, comment, and automation paths;
- role-dependent behavior when the specification distinguishes ordinary members, editors, or
  access managers;
- persistence and reload behavior for every write exercised.

Separate platform-owned identity or access requirements from app-owned profile data. Flag policy
conflicts rather than treating an admin session as proof that all members see the same fields.

## Run layered checks

1. Run installed-source `app_validate` and report errors or material warnings.
2. Obtain the canonical launch descriptor with `app_url_get`, open that URL in the in-app browser,
   and wait through a short bootstrap interval if the first render is transient.
3. Exercise the primary user journey end to end. For writes, use clearly synthetic records, record
   their IDs, and avoid real personal data. Creation success includes seeing the record after a
   reload, not only receiving a success toast.
4. Check every high-priority requirement affected by the change. For a board, test the actual
   creation surface and at least one permitted status move. For collaborative activity, add and
   reload a test comment. For detail views, verify links carry the required route or state.
5. Test additional roles only when the brief or policy depends on them. Record the effective role
   used for each observation; do not infer viewer behavior from an admin session.

If the user authorized test data, state whether the synthetic records will remain as fixtures or
should be removed. Do not delete records without that authority.

## Confirm persistence and diagnose discrepancies

Prefer Keeper MCP full reads for live-data confirmation when the user's intent and
`effectiveAccess` permit it. Direct object-store or database inspection is diagnostic only: use it
only when the user explicitly authorizes that backend, never as a substitute for the Keeper write
contract, and never to mutate app data behind the runtime.

When UI state disagrees with MCP state, capture the installed revision, view, effective role,
record IDs, and exact failing action. Refresh after a bounded runtime-ready wait. Classify the issue
as definition, authorization, runtime bootstrap, persistence, or policy behavior before changing
the candidate.

Report each acceptance item as observed, failed, or not testable, with the evidence that supports
it. Distinguish validation success, deployment success, and behavioral success. Implement obvious
in-scope gaps only when the request authorizes changes; otherwise return the findings and the
smallest recommended fix.
