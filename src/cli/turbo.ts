import { execa } from "execa";
import { PackageManager } from "~/utils/getPackageManager.js";

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

}