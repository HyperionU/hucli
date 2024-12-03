import { execa } from "execa";
import { PackageManager } from "~/utils/getPackageManager.js";
import * as prompt from "@clack/prompts"
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";

export const turboCLI = async (packageManager:PackageManager) => {
    switch (packageManager) {
        case "yarn":
            await execa({stdout: 'inherit', stderr: 'inherit'})`yarn global add turbo`
            break;
        case "pnpm":
            await execa({stdout: 'inherit', stderr: 'inherit'})`pnpm add turbo --global`
            break;
        case "npm":
            await execa({stdout: 'inherit', stderr: 'inherit'})`npm i turbo --global`
            break;
        default:
            break;
    }

    await turboPrompt();

}

const turboPrompt = async () => {
    prompt.note(`Welcome to ${gradient.passion("Turbo")}. Let's get started.`, "Step 2.")
    await setTimeout(1000)
}