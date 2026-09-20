# DynamoDB Notes Example App

This compact, data-free example demonstrates the full declarative shape of a new DynamoDB-backed
Keeper app:

```text
dynamodb-notes/
  app.yaml
  schemas/notes.yaml
  views/home.yaml
```

It deliberately declares logical storage intent only. It has no `data/*.jsonl`, physical table
configuration, or deployment artifacts. Read [Storage](../../reference/storage/index.md) and the
live MCP contract before adapting it. Deployment, job advancement, and launch follow
[Apply](../../workflows/apply.md).

Adapt identifiers and fields to the approved brief. Do not use this example to convert an existing
JSONL app: conversion is a separate, revision-pinned workflow.
