# Import Data

Use to move existing records and collection documents into an installed app, for example from a
development workspace into production. Imports are additive: they create rows and document files
that do not exist yet and never modify or delete anything. They need app-admin authority to
replace raw data and currently support JSONL apps only. Install or update the app's definitions
first with [Apply](apply.md); an import never changes definitions.

## Prepare the import folder

Lay out a local folder with only what should be imported:

```text
data/{table}.jsonl                  # rows to add, one JSON object per line, with their ids
docs/{appId}/{folder}/{file}.md     # collection documents, at the paths their rows name
```

To export from another Keeper workspace, call `app_download` there with `contentScope: "full"`,
`includeDocuments: true`, and `delivery: "link"`, then write it with
`node <skill-dir>/scripts/keeper-app-bundle.mjs download <folder> -` and keep only the tables and
documents to move. Leave rows in their exported form; do not strip fields or regenerate ids, since
other tables refer to them.

Rows keep their ids and values, including timestamps and owners. Fields holding people (owner
fields, references to `keeper_principals` or `keeper_app_members`, and grant tables' principal
fields) are remapped through `identityMap`: source principal id to target principal id. Map an id
to itself to keep it. Document rows get `file_signature` cleared so Keeper re-reads their files.

## Upload, prepare, and review

1. Build the manifest:

   ```bash
   node <skill-dir>/scripts/keeper-app-bundle.mjs manifest <folder> --data-import > manifest.json
   ```

2. Call `app_upload_begin` with `purpose: "data_import"` and the `manifest` array. Fix every
   reported path in one pass.
3. Upload the missing files with
   `node <skill-dir>/scripts/keeper-app-bundle.mjs upload <folder> -`, passing the
   `app_upload_begin` result on standard input. Treat the upload URL and headers as secrets.
4. Call `app_data_import_prepare` with the `bundleId` and any `identityMap`. Nothing is written.
   Review, per table, `newIds`, `identicalIds` (already present, skipped), and `conflictingIds`
   (same id, different content), then `documents`, `unknownPrincipals`, and `diagnostics`.
5. Resolve every conflict, unknown principal, and error before continuing: change the folder or
   `identityMap` and repeat from step 1. A conflicting row is never overwritten; decide with the
   user whether the installed row or the source row is right.

## Apply and confirm

Present the counts of new rows per table and new documents, then call `app_data_import_apply`
with the `importId` and `expectedDefinitionRevision` set to the prepared `definitionRevision`.
Document files are written first, then every new row in one transaction. If apply fails partway,
call it again with the same `importId`, or prepare again: rows and files that already arrived are
recognised as identical and skipped.

Report `created`, `skippedIdentical`, and `documentsWritten`. Open the app and check that the
imported records and their documents appear where expected. Keeper re-reads the imported
documents' files at their collection's next sync.
