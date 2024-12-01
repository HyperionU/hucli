import { execa } from "execa";
import { PackageManager } from "~/utils/getPackageManager.js";
import * as prompt from "@clack/prompts"
import gradient from "gradient-string";
import { setTimeout } from "timers/promises";
import { cliFlags } from "~/installers/index.js";
import { isEmpty } from "~/utils/checkDir.js";

export const nitroxCLI = async (packageManager: PackageManager, flags: cliFlags) => {

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
        /*_: async () => {
            await setTimeout(1000)
            prompt.note("Now, let's add some integrations.", "Step 2b.")
            await setTimeout(1000)
        },
        uiInt: () => prompt.multiselect({
            message: "Any UI Integrations?",
            initialValues: ["react"],
            required: false,
            options: [
                {value: "alpinejs", label: "Alpine"},
                {value: "preact", label: "Preact"},
                {value: "react", label: "React"},
                {value: "solid", label: "Solid"},
                {value: "svelte", label: "Svelte"},
                {value: "vue", label: "Vue"},
            ]
        }),
        ssrInt: () => prompt.select({
            message: "Add SSR Adapter?",
            initialValue: "none",
            options: [
                {value: "cloudflare", label: "Cloudflare"},
                {value: "netlify", label: "Netlify"},
                {value: "node", label: "Node"},
                {value: "vercel", label: "Vercel"},
                {value: "none", label: "No SSR"}
            ],
        }),
        otherInt: () => prompt.multiselect({
            message: "Any UI Integrations?",
            initialValues: ["tailwind"],
            required: false,
            options: [
                {value: "tailwind", label: "Tailwind"},
                {value: "db", label: "AstroDB"},
                {value: "markdoc", label: "MarkDoc"},
                {value: "mdx", label: "MDX"},
                {value: "partytown", label: "Partytown"},
                {value: "sitemap", label: "Sitemap"},
            ]
        }),*/
    },
    {
        onCancel: () => {
            prompt.cancel("Cancelled");
            process.exit(1)
        }
    });

    /*const integrations = [];

    if (config.uiInt.length !== 0) config.uiInt.forEach((element) => {integrations.push(element)})
    if (config.otherInt.length !== 0) config.otherInt.forEach((element) => {integrations.push(element)})
    if (!config.ssrInt.includes("none")) integrations.push(config.ssrInt)*/


    switch (packageManager) {
        case "yarn":
            await execa({stdout: 'inherit', stderr: 'inherit'})`yarn create astro ${config.route} --template minimal --typescript ${config.typescript} ${config.runInstall ? "--install" : "--no-install"} ${config.runInstall ? "--git" : "--no-git"} ${flags.ci ? "--dry-run" : ""}`
            break;
        default:
            await execa({stdout: 'inherit', stderr: 'inherit'})`${packageManager} create astro@latest ${config.route} --template minimal --typescript ${config.typescript} ${config.runInstall ? "--install" : "--no-install"} ${config.runInstall ? "--git" : "--no-git"} ${flags.ci ? "--dry-run" : ""}`
            break;
    }

    /*if (integrations.length !== 0) {
        switch (packageManager) {
            case "npm":
                integrations.forEach(async (element) => {
                    await execa({stdout: 'inherit', stderr: 'inherit'})`npm --prefix ${config.route} i @astrojs/${element}`
                })       
                break;
            case "pnpm":
                integrations.forEach(async (element) => {
                    await execa({stdout: 'inherit', stderr: 'inherit'})`pnpm -C ${config.route} i @astrojs/${element}`
                })       
                break;
            case "yarn":
                integrations.forEach(async (element) => {
                    await execa({stdout: 'inherit', stderr: 'inherit'})`yarn --cwd add @astrojs/${element}`
                })
                break;
            default:
                break;
        }
    }*/



}