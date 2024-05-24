import { exec } from "child_process";
import { Packages } from "./index.js";

interface extensionIDs {
    "vsIcons": string,
    "night": string,
    "mdLint": string,
    "gitLens": string,
    "prettier": string,
    "ghMarkdown": string,
    "htmlHint": string,
    "marp": string,
    "ghActions": string,
}

const IDs: extensionIDs = {
    vsIcons: "vscode-icons-team.vscode-icons",
    night: "enkia.tokyo-night",
    mdLint: "davidanson.vscode-markdownlint",
    gitLens: "eamodio.gitlens",
    prettier: "esbenp.prettier-vscode",
    ghMarkdown: "bierner.github-markdown-preview",
    htmlHint: "htmlhint.vscode-htmlhint",
    marp: "marp-team.marp-vscode",
    ghActions: "github.vscode-github-actions"
}

export async function installPackages(extensions:Packages[]) {
    extensions.forEach(element => {
        let elementID = IDs[element];
        exec(`code --install-extension ${elementID}`)
    });
}