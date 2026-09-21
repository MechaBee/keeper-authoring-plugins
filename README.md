# MechaBee Plugins

This public repository distributes MechaBee's plugins for Codex and Claude Code from one versioned
Git marketplace.

| Plugin | What it does |
| --- | --- |
| **Keeper App Author** | Build and safely evolve declarative [MechaBee Keeper](https://mechabee.com/keeper) apps from a conversation. |
| **Keeper Workspace Content** | Read and safely revise Markdown and other content in your MechaBee workspaces. |

**Keeper App Author** creates complete operational apps: schemas, records, boards, tables,
dashboards, forms, workflows, providers, and agent-assisted actions. It validates the complete
candidate, previews a path-by-path diff, and requires review before applying a change. Existing
live records are preserved by default.

**Keeper Workspace Content** works with the files in your workspaces: browse permitted folders,
read and revise text with a version check on every write, and move larger assets with short-lived,
single-path transfer capabilities.

See the public [installation, permissions, update, and support guide](https://mechabee.com/keeper/app-author).

> **Distribution status:** the Git marketplace is available now as an independent distribution
> channel. Keeper App Author is not yet published in OpenAI's universal Plugins Directory.

## Install for Codex

```bash
codex plugin marketplace add MechaBee/keeper-authoring-plugins
codex plugin add keeper-app-author@mechabee
codex plugin add keeper-workspace-content@mechabee
```

Install either plugin on its own, or both. Complete the MechaBee OAuth flow when prompted, then
start a new Codex task so the plugin's skills and tools are loaded. Each plugin authenticates
separately.

## Install for Claude Code

```bash
claude plugin marketplace add MechaBee/keeper-authoring-plugins
claude plugin install keeper-app-author@mechabee
claude plugin install keeper-workspace-content@mechabee
```

Install either plugin on its own, or both. Complete the MechaBee OAuth flow when prompted, then
start a new Claude Code session. Each plugin authenticates separately.

## Update

Refresh the marketplace, then reinstall the plugin to pick up a newly published version:

```bash
# Codex
codex plugin marketplace upgrade mechabee
codex plugin add <plugin-name>@mechabee

# Claude Code
claude plugin marketplace update mechabee
claude plugin install <plugin-name>@mechabee
```

Every published release increments that plugin's version in both of its platform manifests and in
the marketplace catalogs. Plugins are versioned independently of each other.

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
├── plugins/                      Codex packages
│   ├── keeper-app-author/
│   └── keeper-workspace-content/
└── claude-plugins/                Claude Code packages
    ├── keeper-app-author/
    └── keeper-workspace-content/
```

The Codex and Claude packages are kept separate because their manifests and validation rules can
evolve independently. Runtime resources are duplicated inside each package because plugin clients
install packages into isolated caches.

## Authentication and security

Each plugin connects to its own MechaBee MCP endpoint using MechaBee OAuth — Keeper App Author to
`https://mechabee.com/mcp/keeper`, Keeper Workspace Content to
`https://mechabee.com/mcp/workspace`. Do not paste access tokens, passwords, or MFA codes into
prompts. The plugin bundles contain no credentials and request separate read and write scopes.

Please report security concerns privately to [info@mechabee.com](mailto:info@mechabee.com). For
product support, visit [Keeper App Author support](https://mechabee.com/keeper/app-author#support).

See the [privacy policy](https://mechabee.com/privacy) and
[terms of service](https://mechabee.com/terms).

## Publication materials

The reviewer-ready listing copy, test cases, release notes, and submission checklist are maintained
in [docs/MARKETPLACE_SUBMISSION.md](docs/MARKETPLACE_SUBMISSION.md).
