import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    failures.push(`${relative(repositoryRoot, path)}: ${error.message}`);
    return {};
  }
}

function resolvePackagePath(sourcePath, label) {
  check(typeof sourcePath === "string", `${label}: source path must be a string`);
  if (typeof sourcePath !== "string") return repositoryRoot;

  check(sourcePath.startsWith("./"), `${label}: source path must start with ./`);
  check(!sourcePath.split("/").includes(".."), `${label}: source path must not contain ..`);

  const absolutePath = resolve(repositoryRoot, sourcePath);
  check(
    absolutePath === repositoryRoot || absolutePath.startsWith(`${repositoryRoot}${sep}`),
    `${label}: source path escapes the repository`,
  );
  check(existsSync(absolutePath), `${label}: package directory does not exist`);
  return absolutePath;
}

function validateManifest(path, platform) {
  const manifest = readJson(path);
  check(manifest.name === "keeper-app-author", `${platform}: unexpected manifest name`);
  check(
    typeof manifest.version === "string" &&
      /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(manifest.version),
    `${platform}: version must be strict semantic versioning`,
  );
  check(typeof manifest.description === "string" && manifest.description.length > 20, `${platform}: description is missing`);
  check(manifest.author?.name === "MechaBee", `${platform}: publisher metadata is missing`);
  check(
    manifest.repository === "https://github.com/MechaBee/keeper-authoring-plugins",
    `${platform}: repository URL is missing or incorrect`,
  );
  return manifest;
}

function hashFile(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function listFiles(path, prefix = "") {
  const files = new Map();
  if (!existsSync(path)) return files;

  for (const name of readdirSync(path).sort()) {
    const absolutePath = join(path, name);
    const relativePath = join(prefix, name);
    if (statSync(absolutePath).isDirectory()) {
      for (const [childPath, hash] of listFiles(absolutePath, relativePath)) {
        files.set(childPath, hash);
      }
    } else {
      files.set(relativePath, hashFile(absolutePath));
    }
  }
  return files;
}

function compareTrees(leftRoot, rightRoot, label) {
  const left = listFiles(leftRoot);
  const right = listFiles(rightRoot);
  const allPaths = new Set([...left.keys(), ...right.keys()]);

  for (const path of [...allPaths].sort()) {
    check(left.get(path) === right.get(path), `${label}: packages differ at ${path}`);
  }
}

const codexMarketplace = readJson(join(repositoryRoot, ".agents/plugins/marketplace.json"));
const claudeMarketplace = readJson(join(repositoryRoot, ".claude-plugin/marketplace.json"));

check(codexMarketplace.name === "mechabee", "Codex marketplace name must be mechabee");
check(claudeMarketplace.name === "mechabee", "Claude marketplace name must be mechabee");
check(codexMarketplace.plugins?.length === 1, "Codex marketplace must expose exactly one production plugin");
check(claudeMarketplace.plugins?.length === 1, "Claude marketplace must expose exactly one production plugin");

const codexEntry = codexMarketplace.plugins?.[0] ?? {};
const claudeEntry = claudeMarketplace.plugins?.[0] ?? {};

check(codexEntry.name === "keeper-app-author", "Codex marketplace plugin name is incorrect");
check(claudeEntry.name === "keeper-app-author", "Claude marketplace plugin name is incorrect");
check(codexEntry.policy?.installation === "AVAILABLE", "Codex installation policy must be AVAILABLE");
check(codexEntry.policy?.authentication === "ON_INSTALL", "Codex authentication policy must be ON_INSTALL");

const codexPackage = resolvePackagePath(codexEntry.source?.path, "Codex marketplace");
const claudePackage = resolvePackagePath(claudeEntry.source, "Claude marketplace");
const codexManifestPath = join(codexPackage, ".codex-plugin/plugin.json");
const claudeManifestPath = join(claudePackage, ".claude-plugin/plugin.json");

check(existsSync(codexManifestPath), "Codex package is missing .codex-plugin/plugin.json");
check(!existsSync(join(codexPackage, ".claude-plugin")), "Codex package must not contain a Claude manifest");
check(existsSync(claudeManifestPath), "Claude package is missing .claude-plugin/plugin.json");
check(!existsSync(join(claudePackage, ".codex-plugin")), "Claude package must not contain a Codex manifest");

const codexManifest = validateManifest(codexManifestPath, "Codex");
const claudeManifest = validateManifest(claudeManifestPath, "Claude");
check(codexManifest.version === claudeManifest.version, "Platform plugin versions must match");
check(claudeEntry.version === claudeManifest.version, "Claude marketplace and manifest versions must match");

for (const [label, packageRoot] of [
  ["Codex", codexPackage],
  ["Claude", claudePackage],
]) {
  check(existsSync(join(packageRoot, ".mcp.json")), `${label}: .mcp.json is missing`);
  check(existsSync(join(packageRoot, "README.md")), `${label}: README.md is missing`);
  check(
    existsSync(join(packageRoot, "skills/keeper-declarative-app-authoring/SKILL.md")),
    `${label}: Keeper authoring skill is missing`,
  );
}

for (const assetField of ["composerIcon", "logo", "logoDark"]) {
  const assetPath = codexManifest.interface?.[assetField];
  check(typeof assetPath === "string", `Codex: interface.${assetField} is missing`);
  if (typeof assetPath === "string") {
    check(existsSync(resolve(codexPackage, assetPath)), `Codex: ${assetField} asset does not exist`);
  }
}

const mcpConfig = readJson(join(codexPackage, ".mcp.json"));
for (const [name, server] of Object.entries(mcpConfig.mcpServers ?? {})) {
  check(typeof server.url === "string" && server.url.startsWith("https://"), `MCP server ${name} must use HTTPS`);
  check(!/localhost|127\.0\.0\.1/i.test(server.url ?? ""), `MCP server ${name} must not use a local endpoint`);
}

compareTrees(join(codexPackage, "assets"), join(claudePackage, "assets"), "Assets");
compareTrees(join(codexPackage, "skills"), join(claudePackage, "skills"), "Skills");
check(
  hashFile(join(codexPackage, ".mcp.json")) === hashFile(join(claudePackage, ".mcp.json")),
  "Platform MCP configurations must match",
);

if (failures.length > 0) {
  console.error("Marketplace validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Marketplace validation passed for Codex and Claude Code.");
