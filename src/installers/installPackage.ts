import { exec } from "child_process";
import { Packages } from "./index.js";

interface extensionIDs {
    "vsIcons": string,
    "night": string,
    "mdLint": string,
    "gitLens": string | undefined,
    "prettier": string | undefined,
    "ghMarkdown": string,
    "htmlHint": string | undefined,
    "marp": string | undefined,
    "ghActions": string | undefined,
}

const IDs: extensionIDs = {
    vsIcons: "vscode-icons-team.vscode-icons",
    night: "enkia.tokyo-night",
    mdLint: "davidanson.vscode-markdownlint",
    gitLens: undefined,
    prettier: undefined,
    ghMarkdown: "bierner.github-markdown-preview",
    htmlHint: undefined,
    marp: undefined,
    ghActions: undefined
}

export async function installPackages(extensions:Packages[]) {
    extensions.forEach(element => {
        let elementID = IDs[element];
        exec(`code --install-extension ${elementID}`)
    });
}