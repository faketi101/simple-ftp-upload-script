#!/usr/bin/env node

/**
 * Copy to Dist Script
 *
 * This script copies all files and folders from the project root to a configured
 * destination folder (default: 'dist'), excluding items specified in the config.
 *
 * Usage:
 *   node copy-to-dist.js
 *   npm run copy-to-dist (if added to package.json scripts)
 */

const fs = require("fs");
const path = require("path");

// Load configuration
let config;
try {
  config = require("./copy-to-dist.config.js");
} catch (error) {
  console.error("Error: copy-to-dist.config.js not found!");
  console.error("Please create a configuration file first.");
  process.exit(1);
}

const { distFolder = "dist", disallow = [] } = config;

// Project root directory
const rootDir = __dirname;
const distPath = path.join(rootDir, distFolder);

/**
 * Check if a path should be excluded
 * @param {string} itemPath - Path to check
 * @returns {boolean} - True if should be excluded
 */
function shouldExclude(itemPath) {
  const relativePath = path.relative(rootDir, itemPath);
  const itemName = path.basename(itemPath);

  // Check if the item or its relative path is in the disallow list
  return disallow.some((disallowedItem) => {
    return (
      relativePath === disallowedItem ||
      itemName === disallowedItem ||
      relativePath.startsWith(disallowedItem + path.sep)
    );
  });
}

/**
 * Recursively copy files and directories
 * @param {string} source - Source path
 * @param {string} destination - Destination path
 */
function copyRecursive(source, destination) {
  // Check if source should be excluded
  if (shouldExclude(source)) {
    console.log(`⊗ Skipping: ${path.relative(rootDir, source)}`);
    return;
  }

  // Get stats of source
  const stats = fs.statSync(source);

  if (stats.isDirectory()) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
      console.log(
        `📁 Created directory: ${path.relative(rootDir, destination)}`
      );
    }

    // Read directory contents
    const items = fs.readdirSync(source);

    // Copy each item in the directory
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);
      copyRecursive(sourcePath, destPath);
    }
  } else if (stats.isFile()) {
    // Copy file
    fs.copyFileSync(source, destination);
    console.log(`📄 Copied: ${path.relative(rootDir, source)}`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log("🚀 Starting copy to dist...\n");
  console.log(`📦 Destination folder: ${distFolder}`);
  console.log(
    `🚫 Excluded items: ${disallow.length > 0 ? disallow.join(", ") : "None"}\n`
  );

  // Create dist folder if it doesn't exist
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
    console.log(`✅ Created dist folder: ${distFolder}\n`);
  } else {
    console.log(`⚠️  Dist folder already exists: ${distFolder}\n`);
  }

  // Get all items in root directory
  const items = fs.readdirSync(rootDir);

  // Copy each item
  for (const item of items) {
    const sourcePath = path.join(rootDir, item);
    const destPath = path.join(distPath, item);

    // Skip if it's the dist folder itself or in disallow list
    if (item === distFolder || disallow.includes(item)) {
      console.log(`⊗ Skipping: ${item}`);
      continue;
    }

    copyRecursive(sourcePath, destPath);
  }

  console.log("\n✨ Copy completed successfully!");
  console.log(`📂 Files copied to: ${distPath}`);
}

// Run the script
try {
  main();
} catch (error) {
  console.error("\n❌ Error occurred during copy:");
  console.error(error.message);
  process.exit(1);
}
