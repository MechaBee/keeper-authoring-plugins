# MechaBee Keeper Authoring Plugins

Build and safely evolve declarative [MechaBee Keeper](https://mechabee.com/keeper) apps from a
conversation. This repository distributes Keeper App Author for both Codex and Claude Code from
one versioned Git marketplace.

Keeper App Author can create schemas, records, boards, tables, dashboards, workflows, providers,
and agent-assisted actions. It validates complete app candidates, previews changes, and requires
review before applying them. Existing live records are preserved by default.

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
product support, visit [MechaBee Keeper](https://mechabee.com/keeper#codex-plugin-support).

See the [privacy policy](https://mechabee.com/privacy) and
[terms of service](https://mechabee.com/terms).
