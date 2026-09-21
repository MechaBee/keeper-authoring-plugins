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

function validateManifest(path, platform, expectedName) {
  const manifest = readJson(path);
  check(manifest.name === expectedName, `${platform}: unexpected manifest name`);
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
// Each marketplace may list several plugins; both must list the same set, and
// every plugin is validated on both platforms.
const codexNames = (codexMarketplace.plugins ?? []).map((plugin) => plugin.name).sort();
const claudeNames = (claudeMarketplace.plugins ?? []).map((plugin) => plugin.name).sort();

check(codexNames.length > 0, "Codex marketplace must expose at least one plugin");
check(
  codexNames.join(",") === claudeNames.join(","),
  `Marketplaces list different plugins (Codex: ${codexNames.join(", ")}; Claude: ${claudeNames.join(", ")})`,
);

for (const name of codexNames) {
  const codexEntry = codexMarketplace.plugins.find((plugin) => plugin.name === name) ?? {};
  const claudeEntry = claudeMarketplace.plugins.find((plugin) => plugin.name === name) ?? {};

  check(codexEntry.policy?.installation === "AVAILABLE", `${name}: Codex installation policy must be AVAILABLE`);
  check(codexEntry.policy?.authentication === "ON_INSTALL", `${name}: Codex authentication policy must be ON_INSTALL`);

  const codexPackage = resolvePackagePath(codexEntry.source?.path, `${name}: Codex marketplace`);
  const claudePackage = resolvePackagePath(claudeEntry.source, `${name}: Claude marketplace`);
  const codexManifestPath = join(codexPackage, ".codex-plugin/plugin.json");
  const claudeManifestPath = join(claudePackage, ".claude-plugin/plugin.json");

  check(existsSync(codexManifestPath), `${name}: Codex package is missing .codex-plugin/plugin.json`);
  check(!existsSync(join(codexPackage, ".claude-plugin")), `${name}: Codex package must not contain a Claude manifest`);
  check(existsSync(claudeManifestPath), `${name}: Claude package is missing .claude-plugin/plugin.json`);
  check(!existsSync(join(claudePackage, ".codex-plugin")), `${name}: Claude package must not contain a Codex manifest`);

  if (!existsSync(codexManifestPath) || !existsSync(claudeManifestPath)) continue;

  const codexManifest = validateManifest(codexManifestPath, `${name}: Codex`, name);
  const claudeManifest = validateManifest(claudeManifestPath, `${name}: Claude`, name);
  check(codexManifest.version === claudeManifest.version, `${name}: platform plugin versions must match`);
  check(claudeEntry.version === claudeManifest.version, `${name}: Claude marketplace and manifest versions must match`);

  for (const [label, packageRoot] of [
    ["Codex", codexPackage],
    ["Claude", claudePackage],
  ]) {
    check(existsSync(join(packageRoot, ".mcp.json")), `${name}: ${label} .mcp.json is missing`);
    check(existsSync(join(packageRoot, "README.md")), `${name}: ${label} README.md is missing`);

    // A package must ship at least one skill; the skill's directory name is the
    // plugin's own business.
    const skillsRoot = join(packageRoot, "skills");
    const skills = existsSync(skillsRoot)
      ? readdirSync(skillsRoot).filter((entry) => existsSync(join(skillsRoot, entry, "SKILL.md")))
      : [];
    check(skills.length > 0, `${name}: ${label} package has no skills/<skill>/SKILL.md`);
  }

  for (const assetField of ["composerIcon", "logo", "logoDark"]) {
    const assetPath = codexManifest.interface?.[assetField];
    check(typeof assetPath === "string", `${name}: Codex interface.${assetField} is missing`);
    if (typeof assetPath === "string") {
      check(existsSync(resolve(codexPackage, assetPath)), `${name}: Codex ${assetField} asset does not exist`);
    }
  }

  const mcpConfig = readJson(join(codexPackage, ".mcp.json"));
  for (const [serverName, server] of Object.entries(mcpConfig.mcpServers ?? {})) {
    check(typeof server.url === "string" && server.url.startsWith("https://"), `${name}: MCP server ${serverName} must use HTTPS`);
    check(!/localhost|127\.0\.0\.1/i.test(server.url ?? ""), `${name}: MCP server ${serverName} must not use a local endpoint`);
  }

  compareTrees(join(codexPackage, "assets"), join(claudePackage, "assets"), `${name}: assets`);
  compareTrees(join(codexPackage, "skills"), join(claudePackage, "skills"), `${name}: skills`);
  check(
    hashFile(join(codexPackage, ".mcp.json")) === hashFile(join(claudePackage, ".mcp.json")),
    `${name}: platform MCP configurations must match`,
  );
}

if (failures.length > 0) {
  console.error("Marketplace validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Marketplace validation passed for Codex and Claude Code.");
