import * as prompt from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { Packages } from "../installers/index.js";
import gradient from "gradient-string";
import { installPackages } from "~/installers/installPackage.js";
import { setTimeout } from "timers/promises";

interface cliFlags {
    default: boolean,
    nitrox: boolean,
    /** @internal used in CI. */
    ci: boolean,
    /** @internal Used in CI. */
    vsIcons: boolean;
    /** @internal Used in CI. */
    night: boolean;
    /** @internal Used in CI. */
    mdLint: boolean;
    /** @internal Used in CI. */
    gitLens: boolean;
    /** @internal Used in CI. */
    prettier: boolean;
    /** @internal Used in CI. */
    ghMarkdown: boolean;
    /** @internal Used in CI. */
    htmlHint: boolean;
    /** @internal Used in CI. */
    marp: boolean;
    /** @internal Used in CI. */
    ghActions: boolean;
}

interface cliResults {
    flags: cliFlags,
    packages: Packages[],
}

const defaultOptions: cliResults = {
    flags: {
        default: false,
        nitrox: false,
        ci: false,
        /** @internal Used in CI. */
        vsIcons: false,
        /** @internal Used in CI. */
        night: false,
        /** @internal Used in CI. */
        mdLint: false,
        /** @internal Used in CI. */
        gitLens: false,
        /** @internal Used in CI. */
        prettier: false,
        /** @internal Used in CI. */
        ghMarkdown: false,
        /** @internal Used in CI. */
        htmlHint: false,
        /** @internal Used in CI. */
        marp: false,
        /** @internal Used in CI. */
        ghActions: false,
    },
    packages: ["vsIcons", "night", "marp", "ghActions"]
}

export const runCLI = async (): Promise<cliResults> => {
    const cliResults = defaultOptions;

    const program = new Command()
    .name("huCLI")
    .description("The easiest way to configure your development environment to UofH Standards.")
    .option(
        "--ntrx, --nitrox", 
        "Runs the new Nitrox bootstrapper.", 
        false
    )
    .option(
        "-y, --default",
        "Skip the CLI and bootstrap a new environment using defaults.",
        false
    )
    /** START CI FLAGS */
    /** 
     * @experimental Used for CI Testing. IF any are added, we skip prompts and install based on
     *               flags given.
    */
    .option(
        "--ci",
        "Run CLI in CI mode (Skip prompts and install based on flags).",
        false
    )
    /** @experimental Used for CI Testing, in conjunction with `--CI` Flag. */
    .option(
        "--vsicons [boolean]",
        "Experimental: Boolean if we should install vsicons. Used in conjunction with CI.",
        (value) => !!value && value !== "false"
    )
    /** @experimental Used for CI Testing, in conjunction with `--CI` Flag. */
    .option(
        "--night [boolean]",
        "Experimental: Boolean if we should install Tokyo Night. Used in conjunction with CI.",
        (value) => !!value && value !== "false"
    )
    /** @experimental Used for CI Testing, in conjunction with `--CI` Flag. */
    .option(
        "--mdlint [boolean]",
        "Experimental: Boolean if we should install MarkdownLint. Used in conjunction with CI.",
        (value) => !!value && value !== "false"
    )
    /** @experimental Used for CI Testing, in conjunction with `--CI` Flag. */
    .option(
        "--gitlens [boolean]",
        "Experimental: Boolean if we should install GitLens. Used in conjunction with CI.",
        (value) => !!value && value !== "false"
    )
    /** @experimental Used for CI Testing, in conjunction with `--CI` Flag. */
    .option(
        "--prettier [boolean]",
        "Experimental: Boolean if we should install Prettier. Used in conjunction with CI.",
        (value) => !!value && value !== "false"
    )
    /** @experimental Used for CI Testing, in conjunction with `--CI` Flag. */
    .option(
        "--ghmd [boolean]",
        "Experimental: Boolean if we should install GitHub Markdown Support. Used in conjunction with CI.",
        (value) => !!value && value !== "false"
    )
    /** @experimental Used for CI Testing, in conjunction with `--CI` Flag. */
    .option(
        "--html [boolean]",
        "Experimental: Boolean if we should install HTMLHint. Used in conjunction with CI.",
        (value) => !!value && value !== "false"
    )
    /** @experimental Used for CI Testing, in conjunction with `--CI` Flag. */
    .option(
        "--marp [boolean]",
        "Experimental: Boolean if we should install Marp. Used in conjunction with CI.",
        (value) => !!value && value !== "false"
    )
    /** @experimental Used for CI Testing, in conjunction with `--CI` Flag. */
    .option(
        "--ghact [boolean]",
        "Experimental: Boolean if we should install GitHub Actions. Used in conjunction with CI.",
        (value) => !!value && value !== "false"
    )
    /** END CI FLAGS */
    .version("N/A", "-v, --version", "Display the version number")
    .addHelpText(
        "afterAll",
        `\n U of H's Environment Standard was inspired by ${chalk
          .hex("#E8DCFF")
          .bold(
            "@HyperionU"
          )} and has been used to craft significant applications like ${chalk
          .hex("#E24A8D")
          .underline("https://dub.sh/Nota-Set")} \n`
    )
    .parse(process.argv);

    cliResults.flags = program.opts();

    if (cliResults.flags.ci) {
        cliResults.packages = [];
        if (cliResults.flags.vsIcons) cliResults.packages.push("vsIcons");
        if (cliResults.flags.night) cliResults.packages.push("night");
        if (cliResults.flags.mdLint) cliResults.packages.push("mdLint");
        if (cliResults.flags.gitLens) cliResults.packages.push("gitLens");
        if (cliResults.flags.prettier) cliResults.packages.push("prettier");
        if (cliResults.flags.ghMarkdown) cliResults.packages.push("ghMarkdown");
        if (cliResults.flags.htmlHint) cliResults.packages.push("htmlHint");
        if (cliResults.flags.marp) cliResults.packages.push("marp");
        if (cliResults.flags.ghActions) cliResults.packages.push("ghActions");

        return cliResults;
    }

    if (cliResults.flags.default){
        return cliResults;
    }

    prompt.intro(gradient.atlas("HUCLI"))

    await setTimeout(1000);
    
    const runNitrox = await prompt.confirm({
            message: "Do you want to start the new Nitrox DevKit?",
        }
    )

    runNitrox === true && (cliResults.flags.nitrox = true);

    const config = await prompt.group({
        packageSet: () => {return prompt.select({
            message: "Which set would you like to install?",
            options: [
                {value: "std", label: "Standard"},
                {value: "slim", label: "Slim"},
                {value: "sslim", label: "SuperSlim"},
                {value: "custom", label: "Custom"},
            ],
            initialValue: "std"
        })},
    },
        { onCancel()  {process.exit(1) } }
    );

    const packages: Packages[] = [];

    switch (config.packageSet) {
        case "std":
            let stdPackages: Packages[] = [
                "ghActions", 
                "ghMarkdown", 
                "gitLens", 
                "htmlHint", 
                "marp", 
                "mdLint", 
                "night", 
                "prettier", 
                "vsIcons"
            ];
            stdPackages.forEach(element => {
                packages.push(element);
            });
            break;
        case "slim":
            let slimPackages: Packages[] = [
                "ghActions", 
                "htmlHint", 
                "marp", 
                "night",
                "vsIcons"
            ];
            slimPackages.forEach(element => {
                packages.push(element);
            });
            break;
        case "sslim":
            let sslimPackages: Packages[] = [
                "ghActions",  
                "marp", 
                "night",
                "vsIcons"
            ];
            sslimPackages.forEach(element => {
                packages.push(element);
            });
            break;
        case "custom":
            const customPack = await prompt.multiselect({
                message: "Which packages would you like to install?",
                options: [
                    {value: "vsIcons", label: "VSCode Icons"},
                    {value: "night", label: "Tokyo Night"},
                    {value: "mdLint", label: "MarkdownLint"},
                    {value: "gitLens", label: "GitLens"},
                    {value: "prettier", label: "Prettier"},
                    {value: "ghMarkdown", label: "GitHub Markdown"},
                    {value: "htmlHint", label: "HTMLHint"},
                    {value: "marp", label: "Marp for VS Code"},
                    {value: "ghActions", label: "GitHub Actions"},
                ]
            }) as Packages[];
            let custom: Packages[] = customPack;
            custom.forEach(element => {
                packages.push(element);
            });
            break;
        default:
            break;
    }

    cliResults.packages = packages;

    const spinner = prompt.spinner();

    spinner.start(`${gradient.atlas("Installing Extensions...")}`);
    await installPackages(packages);
    await setTimeout(1000 * packages.length);
    spinner.stop(`${gradient.atlas("Extensions installed.")}`);
    if (cliResults.flags.nitrox) {
        await setTimeout(1000);
        spinner.start(`Starting ${gradient.atlas("Nitrox")} DevKit...`);
        await setTimeout(1000);
        spinner.stop(`${gradient.atlas("Nitrox")} DevKit running.`);
    }
    await setTimeout(1000);
    prompt.outro(`You are now ready to ${gradient.atlas("Hit The Ground Running")}!`);

    return cliResults;
}