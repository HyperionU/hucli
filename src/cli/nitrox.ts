import { execa } from "execa";
import { PackageManager } from "~/utils/getPackageManager.js";
import * as prompt from "@clack/prompts"
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";
import { isEmpty } from "~/utils/checkDir.js";

export const nitroxCLI = async (packageManager: PackageManager) => {

    prompt.note(`Welcome to ${gradient.atlas("Nitrox")}. \nLet's get you up and running.`, "Step 2.");
    await setTimeout(1000);

    const config = await prompt.group({
        route: () => prompt.text({
            message: "What is the path to your new site?",
            placeholder: "./www",
            validate: (value) => {
                if (!value) return 'Please enter a path.';
				if (value[0] !== '.') return 'Please enter a relative path.';
                if (!isEmpty(value)) return 'Please enter an empty path.';
                return;
            }
        }),
        typescript: () => prompt.select({
            message: "How strict should TypeScript be?",
            initialValue: "strict",
            options: [
                {value: "strict", label: "Strict"},
                {value: "strictest", label: "Strictest"},
                {value: "relaxed", label: "Relaxed", hint: "oh no"}
            ],
        }),
        runInstall: () => prompt.confirm({
            message: "Install dependencies?",
            initialValue: true
        }),
        initGit: () => prompt.confirm({
            message: "Initialize a Git Repository?",
            initialValue: false
        }),
    },
    {
        onCancel: () => {
            prompt.cancel("Cancelled");
            process.exit(1)
        }
    });

    await execa({stdout: 'inherit', stderr: 'inherit'})`${packageManager} create astro ${config.route} --template minimal --typescript ${config.typescript} ${config.runInstall ? "--install" : "--no-install"} ${config.initGit ? "--git" : "--no-git"}`

}