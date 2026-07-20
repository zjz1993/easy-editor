#!/usr/bin/env node

/**
 * External Dependencies Checker
 *
 * This script checks if all dependencies that should be externalized
 * are properly configured in tsup.config.base.ts
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Known packages that must be externalized
const MUST_EXTERNAL = [
  'react',
  'react-dom',
  'use-sync-external-store',
  '@tiptap/core',
  '@tiptap/react',
  '@tiptap/pm',
  '@tiptap/starter-kit',
];

// Known packages that should be externalized (common large libraries)
const SHOULD_EXTERNAL = [
  'lodash-es',
  'classnames',
  'clsx',
  'date-fns',
  'dayjs',
  'moment',
  'axios',
  'framer-motion',
  'ahooks',
  '@floating-ui/react',
  'react-hook-form',
  'lowlight',
  'highlight.js',
  'prismjs',
  'react-intl',
  'react-intl-universal',
  'uuid',
  'nanoid',
];

// Patterns from tsup.config.base.ts
const getTsupExternalPatterns = () => {
  const configPath = join(rootDir, 'tsup.config.base.ts');
  if (!existsSync(configPath)) {
    console.error('❌ tsup.config.base.ts not found');
    process.exit(1);
  }

  const configContent = readFileSync(configPath, 'utf-8');

  const patterns = {
    strings: new Set(),
    prefixes: new Set(), // e.g., '@tiptap/', '@textory/', 'rc-'
  };

  // Remove comments first
  const withoutComments = configContent.replace(/\/\/.*$/gm, '');

  // Match string patterns: "package-name"
  const stringMatches = withoutComments.matchAll(/"([^"]+)"/g);
  for (const match of stringMatches) {
    patterns.strings.add(match[1]);
  }

  // Match regex patterns by looking for /^@scope\/ in the config
  // Note: In TypeScript source, / is escaped as \/, so we need to match \\/
  const scopePattern = /\/\^@([a-zA-Z0-9_-]+)\\\/\.\*\//g;
  const scopeMatches = withoutComments.matchAll(scopePattern);
  for (const match of scopeMatches) {
    patterns.prefixes.add('@' + match[1] + '/');
  }

  // Also match non-scoped patterns like /^rc-.*\// (using .* instead of \\/)
  const nonScopePattern = /\/\^([a-zA-Z0-9_-]+)\.\*\//g;
  const nonScopeMatches = withoutComments.matchAll(nonScopePattern);
  for (const match of nonScopeMatches) {
    patterns.prefixes.add(match[1]);
  }

  return patterns;
};

// Check if a package matches any external pattern
const isExternalized = (packageName, patterns) => {
  // Check exact string matches
  if (patterns.strings.has(packageName)) {
    return true;
  }

  // Check if it starts with any string pattern
  for (const str of patterns.strings) {
    if (packageName.startsWith(str + '/')) {
      return true;
    }
  }

  // Check if it matches any prefix pattern
  for (const prefix of patterns.prefixes) {
    if (packageName.startsWith(prefix)) {
      return true;
    }
  }

  return false;
};

// Get all package directories under packages/*
const getPackageDirs = () => {
  const packagesDir = join(rootDir, 'packages');
  return readdirSync(packagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => join(packagesDir, dirent.name))
    .filter(dir => existsSync(join(dir, 'package.json')));
};

// Get all dependencies from all package.json files
const getAllDependencies = () => {
  const packageDirs = getPackageDirs();

  const dependencies = new Set();
  const peerDependencies = new Set();

  packageDirs.forEach(dir => {
    const packageJsonPath = join(dir, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    // Collect all dependencies
    if (packageJson.dependencies) {
      Object.keys(packageJson.dependencies).forEach(dep => dependencies.add(dep));
    }

    if (packageJson.devDependencies) {
      Object.keys(packageJson.devDependencies).forEach(dep => dependencies.add(dep));
    }

    if (packageJson.peerDependencies) {
      Object.keys(packageJson.peerDependencies).forEach(dep => peerDependencies.add(dep));
    }
  });

  return { dependencies, peerDependencies };
};

// Strip leading ^ ~ = from a version specifier and parse the base version
const parseBaseVersion = (version) => {
  const match = String(version).match(/^[~^]?\s*(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return `${match[1]}.${match[2]}.${match[3]}`;
};

// Collect @tiptap/* versions used across all workspace package.json files.
// Returns a Map<tiptapPkg, Map<baseVersion, Array<{ pkg, depType, raw }>>>
const collectTiptapVersions = () => {
  const versionMap = new Map();

  getPackageDirs().forEach(dir => {
    const packageJsonPath = join(dir, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const pkgName = packageJson.name || dir;

    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      const deps = packageJson[depType];
      if (!deps) return;
      Object.entries(deps).forEach(([name, version]) => {
        if (!name.startsWith('@tiptap/')) return;
        const baseVersion = parseBaseVersion(version);
        if (!baseVersion) return;

        if (!versionMap.has(name)) {
          versionMap.set(name, new Map());
        }
        const versions = versionMap.get(name);
        if (!versions.has(baseVersion)) {
          versions.set(baseVersion, []);
        }
        versions.get(baseVersion).push({ pkg: pkgName, depType, raw: version });
      });
    });
  });

  return versionMap;
};

// Read @tiptap/* versions pinned in root package.json's pnpm.overrides
const getTiptapOverrides = () => {
  const rootPkgPath = join(rootDir, 'package.json');
  if (!existsSync(rootPkgPath)) return {};
  const rootPkg = JSON.parse(readFileSync(rootPkgPath, 'utf-8'));
  const overrides = rootPkg?.pnpm?.overrides || {};
  const tiptapOverrides = {};
  Object.entries(overrides).forEach(([name, version]) => {
    if (name.startsWith('@tiptap/')) {
      tiptapOverrides[name] = parseBaseVersion(version) || version;
    }
  });
  return tiptapOverrides;
};

// Check @tiptap/* version consistency across workspace packages.
// Returns { issues: Array, warnings: Array }
const checkTiptapVersionConsistency = () => {
  const versionMap = collectTiptapVersions();
  const overrides = getTiptapOverrides();

  const issues = [];
  const warnings = [];

  // 1. Cross-package consistency: same @tiptap/* must resolve to same base version
  versionMap.forEach((versions, tiptapPkg) => {
    if (versions.size > 1) {
      const foundVersions = Array.from(versions.keys());
      const details = [];
      versions.forEach((locations, baseVersion) => {
        details.push(`       ${baseVersion}:`);
        locations.forEach(loc => {
          details.push(`         - ${loc.pkg} [${loc.depType}]: "${loc.raw}"`);
        });
      });
      issues.push({
        package: tiptapPkg,
        foundVersions,
        detail: details.join('\n'),
      });
    }
  });

  // 2. Drift vs root pnpm.overrides: warn if a package.json uses a different
  //    base version than the override (overrides still wins at install time,
  //    but mismatch makes the repo misleading)
  versionMap.forEach((versions, tiptapPkg) => {
    const overrideVersion = overrides[tiptapPkg];
    if (!overrideVersion) return;
    versions.forEach((locations, baseVersion) => {
      if (baseVersion !== overrideVersion) {
        locations.forEach(loc => {
          warnings.push({
            package: tiptapPkg,
            pkg: loc.pkg,
            depType: loc.depType,
            raw: loc.raw,
            baseVersion,
            overrideVersion,
          });
        });
      }
    });
  });

  return { issues, warnings, scannedPackages: versionMap.size };
};

// Categorize a dependency
const categorizeDependency = (packageName) => {
  // Check if it's a type package
  if (packageName.startsWith('@types/')) {
    return 'TYPE';
  }

  // Check internal packages - MUST external
  if (packageName.startsWith('@textory/')) {
    return 'MUST';
  }

  // Check Tiptap packages - MUST external
  if (packageName.startsWith('@tiptap/') || packageName.startsWith('@tiptap/')) {
    return 'MUST';
  }

  // Check MUST_EXTERNAL list
  if (MUST_EXTERNAL.includes(packageName)) {
    return 'MUST';
  }

  // Check SHOULD_EXTERNAL list
  for (const pattern of SHOULD_EXTERNAL) {
    if (packageName === pattern || packageName.startsWith(pattern + '/')) {
      return 'SHOULD';
    }
  }

  // Check common patterns
  if (packageName.startsWith('rc-')) {
    return 'SHOULD';
  }

  return 'MAY';
};

// Main check function
const main = () => {
  console.log('🔍 Checking external dependencies configuration...\n');

  const patterns = getTsupExternalPatterns();
  const { dependencies, peerDependencies } = getAllDependencies();

  const issues = [];
  const warnings = [];

  // Check each dependency
  dependencies.forEach(dep => {
    const category = categorizeDependency(dep);

    if (category === 'TYPE') return; // Skip type packages
    if (category === 'MUST' && peerDependencies.has(dep)) {
      // It's already a peer dependency, which is good
      return;
    }

    const isExternal = isExternalized(dep, patterns);

    if (category === 'MUST' && !isExternal) {
      issues.push({
        package: dep,
        category: 'MUST',
        reason: 'Must be externalized to avoid runtime errors',
      });
    } else if (category === 'SHOULD' && !isExternal) {
      warnings.push({
        package: dep,
        category: 'SHOULD',
        reason: 'Should be externalized to reduce bundle size',
      });
    }
  });

  // Print results
  console.log('📊 External Configuration Status:\n');
  console.log(`✅ External strings found: ${patterns.strings.size}`);
  console.log(`✅ External prefix patterns found: ${patterns.prefixes.size}`);
  console.log(`📦 Total dependencies: ${dependencies.size}`);
  console.log(`🔗 Peer dependencies: ${peerDependencies.size}\n`);

  if (issues.length > 0) {
    console.log('❌ CRITICAL ISSUES FOUND:\n');
    issues.forEach((issue, i) => {
      console.log(`  ${i + 1}. ${issue.package}`);
      console.log(`     Category: ${issue.category}`);
      console.log(`     Reason: ${issue.reason}`);
      console.log(`     Action: Add "${issue.package}" to external in tsup.config.base.ts\n`);
    });
  }

  if (warnings.length > 0) {
    console.log('⚠️  RECOMMENDATIONS:\n');
    warnings.forEach((warning, i) => {
      console.log(`  ${i + 1}. ${warning.package}`);
      console.log(`     Category: ${warning.category}`);
      console.log(`     Reason: ${warning.reason}`);
      console.log(`     Action: Consider adding to external (optional but recommended)\n`);
    });
  }

  if (issues.length === 0 && warnings.length === 0) {
    console.log('✅ All dependencies are properly configured!\n');
    console.log('Current external strings:');
    patterns.strings.forEach((str, i) => {
      console.log(`  ${i + 1}. "${str}"`);
    });
    console.log('\nCurrent external prefix patterns:');
    patterns.prefixes.forEach((prefix, i) => {
      console.log(`  ${i + 1}. packages starting with "${prefix}"`);
    });
  }

  // === @tiptap/* version consistency check ===
  console.log('\n🔬 Checking @tiptap/* version consistency...\n');
  const tiptapCheck = checkTiptapVersionConsistency();
  console.log(`📦 Scanned ${tiptapCheck.scannedPackages} @tiptap/* package(s) across workspace.\n`);

  if (tiptapCheck.issues.length > 0) {
    console.log('❌ TIPTAP VERSION MISMATCH FOUND:\n');
    tiptapCheck.issues.forEach((issue, i) => {
      console.log(`  ${i + 1}. ${issue.package}`);
      console.log(`     Found versions: ${issue.foundVersions.join(', ')}`);
      console.log(issue.detail);
      console.log(`     Action: Align all package.json files to the same base version,`);
      console.log(`             and pin it in root package.json's pnpm.overrides.\n`);
    });
  } else {
    console.log('✅ All @tiptap/* packages use consistent versions across workspace packages.\n');
  }

  if (tiptapCheck.warnings.length > 0) {
    console.log('⚠️  TIPTAP VERSION DRIFT (vs pnpm.overrides):\n');
    tiptapCheck.warnings.forEach((warning, i) => {
      console.log(`  ${i + 1}. ${warning.package}`);
      console.log(`     ${warning.pkg} [${warning.depType}] uses "${warning.raw}" (${warning.baseVersion})`);
      console.log(`     but pnpm.overrides pins it to ${warning.overrideVersion}.`);
      console.log(`     Action: Update package.json to align with the override for clarity.\n`);
    });
  }

  // Exit with error if there are critical issues (including tiptap mismatches)
  const totalIssues = issues.length + tiptapCheck.issues.length;
  const totalWarnings = warnings.length + tiptapCheck.warnings.length;
  if (totalIssues > 0) {
    console.log(`\n❌ Found ${totalIssues} critical issue(s) that must be fixed before publishing!`);
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log(`\n⚠️  Found ${totalWarnings} recommendation(s). Consider addressing them for optimal bundle size.`);
    process.exit(0);
  } else {
    console.log('\n✅ External configuration is perfect! Ready to publish.');
    process.exit(0);
  }
};

main();
