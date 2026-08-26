# MechaBee Keeper Authoring Plugins

Build and safely evolve declarative [MechaBee Keeper](https://mechabee.com/keeper) apps from a
conversation. This public repository distributes Keeper App Author for Codex and Claude Code from
one versioned Git marketplace.

Keeper App Author creates complete operational apps: schemas, records, boards, tables, dashboards,
forms, workflows, providers, and agent-assisted actions. It validates the complete candidate,
previews a path-by-path diff, and requires review before applying a change. Existing live records
are preserved by default.

See the public [installation, permissions, update, and support guide](https://mechabee.com/keeper/app-author).

> **Distribution status:** the Git marketplace is available now as an independent distribution
> channel. Keeper App Author is not yet published in OpenAI's universal Plugins Directory.

## Install for Codex

```bash
codex plugin marketplace add MechaBee/keeper-authoring-plugins
codex plugin add keeper-app-author@mechabee
```

Complete the MechaBee OAuth flow when prompted, then start a new Codex task so the plugin's skills
and Keeper tools are loaded.

## Install for Claude Code

```bash
claude plugin marketplace add MechaBee/keeper-authoring-plugins
claude plugin install keeper-app-author@mechabee
```

Complete the MechaBee OAuth flow when prompted, then start a new Claude Code session.

## Update

Refresh the marketplace, then reinstall the plugin to pick up a newly published version:

```bash
# Codex
codex plugin marketplace upgrade mechabee
codex plugin add keeper-app-author@mechabee

# Claude Code
claude plugin marketplace update mechabee
claude plugin install keeper-app-author@mechabee
```

Every published release increments the plugin version in both platform manifests and marketplace
catalogs.

## Start with a real brief

Try one of these after installation:

- `Build a service dispatch app with customers, equipment, work orders, technicians, and recurring maintenance.`
- `Inspect my existing Keeper app and add an approval step without changing its live records.`
- `Create a project delivery board with owners, status, due dates, and a weekly summary action.`

The plugin will discover the exact MechaBee agent and workspace, read the current Keeper contract,
and show the deployment diff before asking to apply it.

## Repository layout

```text
.
├── .agents/plugins/marketplace.json
├── .claude-plugin/marketplace.json
├── plugins/keeper-app-author/
└── claude-plugins/keeper-app-author/
```

The Codex and Claude packages are kept separate because their manifests and validation rules can
evolve independently. Runtime resources are duplicated inside each package because plugin clients
install packages into isolated caches.

## Authentication and security

Keeper App Author connects to `https://mechabee.com/mcp/keeper` using MechaBee OAuth. Do not paste
access tokens, passwords, or MFA codes into prompts. The plugin bundle contains no credentials and
requests separate read and write scopes.

Please report security concerns privately to [info@mechabee.com](mailto:info@mechabee.com). For
product support, visit [Keeper App Author support](https://mechabee.com/keeper/app-author#support).

See the [privacy policy](https://mechabee.com/privacy) and
[terms of service](https://mechabee.com/terms).

## Publication materials

The reviewer-ready listing copy, test cases, release notes, and submission checklist are maintained
in [docs/MARKETPLACE_SUBMISSION.md](docs/MARKETPLACE_SUBMISSION.md).
