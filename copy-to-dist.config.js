    /**
     * Configuration for copy-to-dist script
     */
    module.exports = {
    // The destination folder name (relative to project root)
    distFolder: "dist",

    // Files and folders to exclude from copying (relative to project root)
    disallow: [
        "node_modules",
        ".git",
        "dist", // Don't copy the dist folder itself
        ".env.local",
        ".env.development",
        ".env.production",
        "pnpm-lock.yaml",
        "package-lock.json",
        "yarn.lock",
        ".gitignore",
        ".eslintrc",
        ".prettierrc",
        ""

    ],
    };
  
