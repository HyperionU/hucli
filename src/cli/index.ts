import * as prompt from "@clack/prompts";
import chalk from "chalk";
import cluster from "cluster";
import { Command } from "commander";
import { Packages } from "../installers";

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


    return cliResults;
}