import * as prompt from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";

interface cliFlags {
    default: boolean,
    nitrox: boolean,
    ci: boolean,
}

interface cliResults {
    flags: cliFlags
}

const defaultOptions: cliResults = {
    flags: {
        default: false,
        nitrox: false,
        ci: false,
    }
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
    .option(
        "--ci",
        "Run CLI in CI mode (Skip prompts and install based on flags).",
        false
    )
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

    return cliResults;
}