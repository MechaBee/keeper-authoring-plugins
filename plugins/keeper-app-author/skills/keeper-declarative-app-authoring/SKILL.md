---
name: keeper-declarative-app-authoring
description: Create, inspect, download, update, validate, deploy, delete, migrate, and repair Keeper applications through the Keeper MCP server. Use for Keeper workspace discovery; app, schema, view, workflow, agent, and JSONL authoring; and preview or launch tasks.
---

# Keeper App Authoring

Use the Keeper MCP tools to work on installed applications. Prefer the server's current tool
schemas, runtime contract, and validation diagnostics over bundled syntax examples. If they
disagree, report the discrepancy and resolve it before depending on the disputed behavior.

## Choose the task path

Read the workflow matching the user's request. Read additional material only when that task needs it.

| Task | Start here |
| --- | --- |
| Find, inspect, download, check, or open an app | [Inspect and open](workflows/inspect-and-open.md) |
| Create an app or change its definitions | [Author and update](workflows/author-and-update.md) |
| Apply a prepared definition change | [Apply](workflows/apply.md) |
| Migrate data, convert storage, or repair deployment | [Migrate and repair](workflows/migrate-and-repair.md) |
| Permanently delete an app or resume its deletion | [Delete an app](workflows/delete.md) |
| Inspect, advance, retry, or cancel an existing job | [Job control](workflows/jobs.md) |

For a new app or substantial redesign, use [app design](design/app-design.md). A focused edit needs
only the affected design decisions and their syntax. The [reference index](reference/index.md)
routes by layer: application, schema, views, automation, app security, and storage. Read the exact
pages needed to author unfamiliar keys; examples do not extend the supported syntax.

## Essential boundaries

- Use the installed plugin's single Keeper MCP server throughout an app task. Preserve exact
  `agentId`, `workspaceId`, and `appId` values obtained through discovery. Never guess a write target;
  ask when the requested target cannot be resolved unambiguously. The server supplies its domain.
- For existing definition work, use `contentScope: "definitions"` and `dataMode: "preserve"`.
  Omit live JSONL; preservation happens on the server. Raw-data access or replacement requires
  the corresponding `effectiveAccess` capability and explicit user intent to handle live data.
- App membership belongs to the control plane, never `app.yaml`. Read [app security](reference/security/index.md)
  when creating tables or changing membership, row visibility, mutation restrictions, or sharing.
  View filters do not enforce row access.
- Validate a candidate and review its material diff before applying. Follow the revision and
  acknowledgement rules in [Apply](workflows/apply.md); never weaken a stale-stage check.
- Authenticate through the plugin's MCP OAuth flow. Browser sign-in is separate. Never copy an
  MCP token into a browser URL, prompt, or file, or request the user's credentials.

## Deliver the requested result

Complete the views, actions, navigation, and dependent definitions needed by the brief. Add seeds,
automation, and sharing only where required. Existing guide documents must be retained unless their
removal is intended; guide authoring advice is in [user guides](design/user-guide.md).

Use [examples](examples/index.md) when they clarify a composition. There is no required example
count or fixed screen count. Preserve runtime binding roots and valid action envelopes while
adapting the domain and topology. Report the result, validation, material data impact, and any
remaining blocker. When deployment completes, provide the returned launch link.
