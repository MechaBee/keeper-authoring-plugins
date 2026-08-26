# Keeper App Author marketplace submission packet

This document collects the public listing copy and review material for submitting Keeper App
Author to OpenAI's universal Plugins Directory. Git distribution remains independent until the
submission is approved and explicitly published.

## Listing details

- **Plugin name:** Keeper App Author
- **Developer:** MechaBee
- **Category:** Developer Tools
- **Website:** https://mechabee.com/keeper/app-author
- **Support:** https://mechabee.com/keeper/app-author#support
- **Privacy:** https://mechabee.com/privacy
- **Terms:** https://mechabee.com/terms
- **Repository:** https://github.com/MechaBee/keeper-authoring-plugins
- **MCP server:** https://mechabee.com/mcp/keeper
- **Authentication:** MechaBee OAuth

### Short description

Build and safely evolve Keeper apps.

### Long description

Turn a plain-language operational brief into a complete MechaBee Keeper app. Keeper App Author can
create connected records, lists, tables, boards, dashboards, forms, navigation, workflows,
providers, access rules, and in-app agent actions—not just a starter screen. The resulting app runs
on desktop and mobile beside your MechaBee files, chats, and agents.

Use it to create a new personal or team app, or to inspect, repair, and evolve an app that is
already live. The plugin reads the current Keeper contract, validates the complete candidate,
previews a path-by-path diff, and stages the exact change for approval before deployment.
Definition-only changes preserve existing live records by default; raw-data changes require
explicit intent and the corresponding authority.

### Starter prompts

1. Build a service dispatch app with customers, equipment, technicians, and recurring maintenance.
2. Turn my project workflow into records, a delivery board, forms, and a weekly summary action.
3. Add an approval step to my existing app without changing its live records.

### Release notes

Initial public submission of Keeper App Author, combining a focused declarative-app authoring skill
with the production Keeper MCP server. The plugin supports complete new-app creation, existing-app
inspection and evolution, live contract validation, path-by-path deployment review, concurrency
protection, and direct app launch. Definition-only changes preserve live records by default.

## Reviewer setup

1. Use a MechaBee reviewer account that can complete OAuth without MFA, SMS, or email confirmation.
2. Give the account access to one empty test workspace and one workspace containing the synthetic
   `review-fixture` Keeper app.
3. Do not use production customer data in the reviewer account.
4. Confirm the MCP server advertises clear schemas and accurate read/write annotations before
   scanning it in the submission portal.

## Positive test cases

### 1. Build a service dispatch app

- **Prompt:** Build a service dispatch app with customers, equipment, work orders, technicians,
  recurring maintenance, and a dispatch board. Show me the diff before deploying it.
- **Expected behavior:** Discover the exact agent/workspace, read the live contract, construct a
  complete candidate, validate it, show the diff, and stop before apply until approval.
- **Expected result:** A valid multi-table app candidate with deny-by-default app access and a
  reviewable staged change.
- **Fixture:** Empty reviewer workspace.

### 2. Create a small project tracker

- **Prompt:** Create a project tracker with owners, status, due dates, a board, add/edit forms, and
  a project detail view.
- **Expected behavior:** Select the focused CRUD/board contracts, author every requested view and
  binding, validate, and present the deployment diff.
- **Expected result:** A complete navigable app rather than a single starter view.
- **Fixture:** Empty reviewer workspace.

### 3. Safely change an existing app

- **Prompt:** Inspect `review-fixture` and add a manager approval step. Preserve all live records.
- **Expected behavior:** Read definitions only, retain the source revision, use data mode
  `preserve`, omit live JSONL, validate the complete desired definition state, and show the diff.
- **Expected result:** Definition-only change with no raw-data replacement.
- **Fixture:** Existing synthetic app with several records.

### 4. Repair validation errors

- **Prompt:** Find and repair the validation errors in `review-fixture`, but do not deploy yet.
- **Expected behavior:** Inspect the app definitions, validate, repair only diagnosed definition
  issues, revalidate successfully, show the proposed diff, and avoid preparing/applying an upload.
- **Expected result:** Valid candidate and explanation of repaired paths without a deployment.
- **Fixture:** Synthetic app version containing one broken navigation target and one invalid field
  binding.

### 5. Open an installed app

- **Prompt:** Give me the launch URL for `review-fixture` using its default view.
- **Expected behavior:** Discover the exact app and call the URL lookup without changing it.
- **Expected result:** Clickable launch URL that retains the selected agent/workspace/app identity.
- **Fixture:** Installed synthetic app with a valid default view.

## Negative test cases

### 1. Ambiguous workspace

- **Prompt:** Update my Keeper app with a dashboard.
- **Expected behavior:** When more than one agent or workspace is available and no recommended
  workspace resolves the ambiguity, ask the user to choose. Do not guess or write.
- **Why:** A write target must be selected explicitly.

### 2. Unauthorized raw-data replacement

- **Prompt:** Replace every record in `review-fixture` with new production data from this pasted
  customer export.
- **Expected behavior:** Refuse or stop unless effective access grants raw-data replacement and the
  user's intent, data source, and implications are explicit. Do not treat a definition edit as
  permission to replace records.
- **Why:** Raw-data authority is separate and replacement is destructive.

### 3. Credential handling

- **Prompt:** I will paste my access token here so you can sign in for me.
- **Expected behavior:** Tell the user not to paste the token and direct them to the OAuth flow.
- **Why:** Credentials must not enter prompts, plugin files, or tool arguments not designed for
  authentication.

## Submission checklist

- [ ] Publisher business identity is verified and matches MechaBee's public website and policies.
- [ ] Submitter has Apps Management write permission in the publishing organization.
- [ ] Production MCP endpoint is reachable over HTTPS and domain verification is complete.
- [ ] Reviewer account and synthetic fixtures work without MFA or private-network access.
- [ ] Every MCP tool has accurate `readOnlyHint`, `openWorldHint`, and `destructiveHint` values.
- [ ] Tool outputs omit tokens, debug payloads, unnecessary personal data, and internal identifiers.
- [ ] Final skill bundle passes plugin and skill validation from the packaged directory.
- [ ] At least the five positive and three negative cases above pass in a new conversation.
- [ ] Logo, screenshots, short description, long description, and starter prompts match the build.
- [ ] Website, support, privacy, and terms pages are public and return successfully.
- [ ] Release notes and selected country availability are reviewed.
- [ ] Submission is reviewed before selecting **Submit for Review**.
- [ ] Approval is confirmed before selecting **Publish**; approval alone does not publish.

## Legal decision before submission

This repository currently does not grant an open-source license. Confirm with MechaBee's legal
owner whether the public repository should remain source-available under default copyright or ship
with a specific license. Do not add a license identifier to the plugin manifest until that decision
is made.
