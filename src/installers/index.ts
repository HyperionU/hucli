

export const packages = [
    "vsIcons",
    "night",
    "mdLint",
    "gitLens",
    "prettier",
    "ghMarkdown",
    "htmlHint",
    "marp",
    "ghActions",
] as const;

export type Packages = (typeof packages)[number];

