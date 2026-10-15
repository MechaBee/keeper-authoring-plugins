#!/usr/bin/env node
// Keeper app bundle helper. Zero dependencies; Node.js 18 or newer.
//
//   node keeper-app-bundle.mjs manifest <app-dir> [--definitions-only]
//       Print {"manifest":[{path,sha256,sizeBytes}]} for app_upload_begin.
//       --definitions-only leaves data/*.jsonl out (definition work on an existing app).
//       --data-import lists data/*.jsonl and docs/<app>/... documents instead (purpose data_import).
//   node keeper-app-bundle.mjs upload <app-dir> <begin-result.json | ->
//       PUT the files app_upload_begin listed as missing. Never prints the URL.
//   node keeper-app-bundle.mjs download <app-dir> <download-result.json | -> [--overwrite]
//       Fetch an app_download (delivery "link") artifact, check every hash, and write the files.
//       Refuses to replace existing local app files unless --overwrite is given.
//   node keeper-app-bundle.mjs verify <app-dir> <result.json | ->
//       Compare the files[] hashes in a prepare, apply or app_get result with the local files.
//
// The wire format is plain: sha256 is lowercase hex over each file's UTF-8 bytes,
// and the upload body is {"files":[{"path","content"}]}. Any equivalent tooling works.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

// Mirrors shared/keeper/app-files.ts (isKeeperAppFilePath); a repository test keeps them equal.
const ALLOWED_APP_FILE_PATTERNS = [
  /^app\.yaml$/,
  /^notifications\.yaml$/,
  /^(?:schemas|views|workflows|agents)\/[A-Za-z0-9_-]+\.ya?ml$/,
  /^ai\/[A-Za-z0-9_-]+\.md$/,
  /^docs\/[A-Za-z0-9_-]+\.md$/,
  /^data\/[A-Za-z0-9_-]+\.jsonl$/,
];

export function isAllowedAppFile(path) {
  return ALLOWED_APP_FILE_PATTERNS.some((pattern) => pattern.test(path));
}

// Data import bundles: table rows plus files of the app's document tree (docs/<app>/<folder>/...).
const IMPORT_DOCUMENT_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9 ._-]*$/;

export function isImportFile(path) {
  if (/^data\/[A-Za-z0-9_-]+\.jsonl$/.test(path)) return true;
  const segments = path.split("/");
  return segments[0] === "docs" && segments.length >= 3 && segments.slice(1).every((segment) => IMPORT_DOCUMENT_SEGMENT.test(segment));
}

const IGNORED_NAMES = new Set([".DS_Store", ".git", "node_modules", "__MACOSX"]);

function walk(root, current = root, found = []) {
  for (const entry of readdirSync(current, { withFileTypes: true })) {
    if (IGNORED_NAMES.has(entry.name) || entry.name.startsWith("._")) continue;
    const absolute = join(current, entry.name);
    if (entry.isDirectory()) walk(root, absolute, found);
    else if (entry.isFile()) found.push(relative(root, absolute).split(sep).join("/"));
  }
  return found;
}

function readAppFiles(appDir, accept = isAllowedAppFile, label = "Keeper app files") {
  const paths = walk(appDir).sort();
  const excluded = paths.filter((path) => !accept(path));
  if (excluded.length > 0) {
    console.error(`Excluded (not ${label}): ${excluded.join(", ")}`);
  }
  return paths.filter(accept).map((path) => {
    const content = readFileSync(join(appDir, path), "utf8");
    return { path, content };
  });
}

function digest(content) {
  return {
    sha256: createHash("sha256").update(content, "utf8").digest("hex"),
    sizeBytes: Buffer.byteLength(content, "utf8"),
  };
}

function readJsonArgument(argument) {
  const text = argument === "-" ? readFileSync(0, "utf8") : readFileSync(argument, "utf8");
  const parsed = JSON.parse(text);
  // Accept a bare tool result or one wrapped as {structuredContent: ...}.
  return parsed && typeof parsed === "object" && parsed.structuredContent ? parsed.structuredContent : parsed;
}

function manifest(appDir, definitionsOnly, dataImport) {
  const files = dataImport
    ? readAppFiles(appDir, isImportFile, "data import files")
    : readAppFiles(appDir).filter((file) => !definitionsOnly || !file.path.startsWith("data/"));
  if (!dataImport && !files.some((file) => file.path === "app.yaml")) {
    throw new Error(`No app.yaml in ${appDir}.`);
  }
  if (files.length === 0) throw new Error(`No files to send in ${appDir}.`);
  const entries = files.map((file) => ({ path: file.path, ...digest(file.content) }));
  const totalBytes = entries.reduce((total, entry) => total + entry.sizeBytes, 0);
  console.error(`${entries.length} file(s), ${totalBytes} bytes.`);
  process.stdout.write(`${JSON.stringify({ manifest: entries })}\n`);
}

async function upload(appDir, resultArgument) {
  const result = readJsonArgument(resultArgument);
  if (!result || result.ok !== true || !Array.isArray(result.missing)) {
    throw new Error("Pass the app_upload_begin result (ok, bundleId, missing, upload).");
  }
  if (result.missing.length === 0) {
    console.error("Nothing to upload: the server already holds every file.");
    return;
  }
  if (!result.upload || typeof result.upload.url !== "string") {
    throw new Error("The app_upload_begin result has no upload capability.");
  }
  const root = resolve(appDir);
  const files = result.missing.map((path) => {
    const absolute = resolve(root, ...String(path).split("/"));
    if (!absolute.startsWith(`${root}${sep}`) || (!isAllowedAppFile(path) && !isImportFile(path))) {
      throw new Error(`Refusing to upload a path outside the app folder rules: ${path}`);
    }
    if (!existsSync(absolute)) throw new Error(`Missing file is not in ${appDir}: ${path}`);
    return { path, content: readFileSync(absolute, "utf8") };
  });
  const body = JSON.stringify({ files });
  const response = await fetch(result.upload.url, {
    method: result.upload.method || "PUT",
    headers: result.upload.headers || {},
    body,
  });
  if (!response.ok) {
    throw new Error(`Upload failed with HTTP ${response.status}. Call app_upload_begin again if the capability expired.`);
  }
  console.error(`Uploaded ${files.length} file(s), ${Buffer.byteLength(body, "utf8")} bytes, to bundle ${result.bundleId}.`);
}

async function download(appDir, resultArgument, overwrite) {
  const parsed = readJsonArgument(resultArgument);
  const result = parsed && parsed.artifact ? parsed.artifact : parsed;
  if (!result || !result.download || typeof result.download.url !== "string" || !Array.isArray(result.files)) {
    throw new Error('Pass the app_download result requested with delivery "link".');
  }
  const response = await fetch(result.download.url, {
    method: result.download.method || "GET",
    headers: result.download.headers || {},
  });
  if (!response.ok) {
    throw new Error(`Download failed with HTTP ${response.status}. Call app_download again if the capability expired.`);
  }
  const artifact = await response.json();
  const files = Array.isArray(artifact?.files) ? artifact.files : null;
  if (!files) throw new Error("The downloaded artifact has no files.");
  const expected = new Map(result.files.map((file) => [file.path, file]));
  const problems = [];
  for (const file of files) {
    if (typeof file.path !== "string" || typeof file.content !== "string" || !isAllowedAppFile(file.path)) {
      problems.push(`${file.path}: not an allowed Keeper app file`);
      continue;
    }
    const wanted = expected.get(file.path);
    const actual = digest(file.content);
    if (!wanted || wanted.sha256 !== actual.sha256 || wanted.sizeBytes !== actual.sizeBytes) {
      problems.push(`${file.path}: does not match the hash Keeper reported`);
    }
    expected.delete(file.path);
  }
  for (const path of expected.keys()) problems.push(`${path}: missing from the download`);
  const documents = Array.isArray(artifact.documents) ? artifact.documents : [];
  const expectedDocuments = new Map((Array.isArray(result.documents) ? result.documents : []).map((file) => [file.path, file]));
  for (const file of documents) {
    const wanted = expectedDocuments.get(file.path);
    const actual = typeof file.content === "string" ? digest(file.content) : null;
    if (!isImportFile(String(file.path)) || !wanted || !actual || wanted.sha256 !== actual.sha256 || wanted.sizeBytes !== actual.sizeBytes) {
      problems.push(`${file.path}: document does not match the hash Keeper reported`);
    }
    expectedDocuments.delete(file.path);
  }
  for (const path of expectedDocuments.keys()) problems.push(`${path}: document missing from the download`);
  if (problems.length > 0) throw new Error(`Download rejected, nothing written:\n${problems.join("\n")}`);

  const existing = existsSync(appDir) ? readAppFiles(appDir) : [];
  if (existing.length > 0 && !overwrite) {
    throw new Error(`${appDir} already holds ${existing.length} app file(s). Use an empty folder, or pass --overwrite to replace them.`);
  }
  for (const file of [...files, ...documents]) {
    const target = join(appDir, ...file.path.split("/"));
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content, "utf8");
  }
  const downloaded = new Set(files.map((file) => file.path));
  const leftovers = existing.map((file) => file.path).filter((path) => !downloaded.has(path));
  if (leftovers.length > 0) {
    console.error(`Local app files not in the installed app (left in place): ${leftovers.join(", ")}`);
  }
  console.error(`Wrote ${files.length} file(s)${documents.length ? ` and ${documents.length} document(s)` : ""} at revision ${result.revision ?? "unknown"}; every hash matched.`);
}

function verify(appDir, resultArgument) {
  const result = readJsonArgument(resultArgument);
  const remote = Array.isArray(result?.files) ? result.files : null;
  if (!remote) throw new Error("Pass a prepare, apply, or app_get result that has files[].");
  const remoteByPath = new Map(remote.map((file) => [file.path, file]));
  // Definition-only results omit live data, so local data files are compared only when listed.
  const includeData = remote.some((file) => file.path.startsWith("data/"));
  const local = readAppFiles(appDir).filter((file) => includeData || !file.path.startsWith("data/"));
  const problems = [];
  for (const file of local) {
    const theirs = remoteByPath.get(file.path);
    if (!theirs) {
      problems.push(`${file.path}: not on the server`);
      continue;
    }
    const ours = digest(file.content);
    if (theirs.sha256 !== ours.sha256 || theirs.sizeBytes !== ours.sizeBytes) {
      problems.push(`${file.path}: content differs`);
    }
    remoteByPath.delete(file.path);
  }
  for (const path of remoteByPath.keys()) {
    if (includeData || !path.startsWith("data/")) problems.push(`${path}: on the server but not local`);
  }
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    process.exitCode = 1;
    return;
  }
  console.error(`All ${local.length} file(s) match exactly.`);
}

async function main(argv) {
  const flags = new Set(["--definitions-only", "--overwrite", "--data-import"]);
  const definitionsOnly = argv.includes("--definitions-only");
  const dataImport = argv.includes("--data-import");
  const overwrite = argv.includes("--overwrite");
  const [command, appDir, resultArgument] = argv.filter((argument) => !flags.has(argument));
  if (command === "manifest" && appDir) return manifest(appDir, definitionsOnly, dataImport);
  if (command === "upload" && appDir && resultArgument) return upload(appDir, resultArgument);
  if (command === "download" && appDir && resultArgument) return download(appDir, resultArgument, overwrite);
  if (command === "verify" && appDir && resultArgument) return verify(appDir, resultArgument);
  console.error("Usage: keeper-app-bundle.mjs manifest <app-dir> [--definitions-only | --data-import] | upload <app-dir> <result.json|-> | download <app-dir> <result.json|-> [--overwrite] | verify <app-dir> <result.json|->");
  process.exitCode = 2;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("keeper-app-bundle.mjs")) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
