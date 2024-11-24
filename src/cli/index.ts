import * as prompt from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { Packages } from "~/installers/index.js";
import gradient from "gradient-string";
import { installPackages } from "~/installers/installPackage.js";
import { setTimeout } from "timers/promises";
import { packagePrompt, install, configPrompt} from "~/utils/prompts.js";
import { PackageManager } from "~/utils/getPackageManager.js";

interface cliFlags {
    default: boolean,
    nitrox: boolean,
    turbo: boolean,
}

interface cliResults {
    flags: cliFlags,
    packages: Packages[],
}

const defaultOptions: cliResults = {
    flags: {
        default: false,
        nitrox: false,
        turbo: false,
    },
    packages: ["vsIcons", "night", "marp", "ghActions"]
}

export const runCLI = async (packageManager: PackageManager): Promise<cliResults> => {
    const cliResults = defaultOptions;

    const program = new Command()
    .name("huCLI")
    .description("The easiest way to configure your development environment to UofH Standards.")
    .version(chalk.grey("1.0.0"))

    program
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
    
    program.parse(process.argv);

    cliResults.flags = program.opts();

    const nitroxPackages: Packages[] = [
        "Astro",
        "Tailwind"
    ]

    if (cliResults.flags.default){
        return cliResults;
    }

    prompt.intro(gradient.atlas("HUCLI"));

    const config = await configPrompt(packageManager)
    
    config.nitrox && (cliResults.flags.nitrox = true);

    const packageSet = await packagePrompt();

    const packages: Packages[] = await install(packageSet)

    cliResults.packages = packages;

    const spinner = prompt.spinner();

    spinner.start(`${gradient.atlas("Installing Extensions...")}`);
    await installPackages(packages);
    await setTimeout(1000 * packages.length);
    spinner.stop(`${gradient.atlas("Extensions installed.")}`);
    if (cliResults.flags.nitrox) {
        await setTimeout(1000);
        spinner.start(`Starting ${gradient.atlas("Nitrox")} DevKit...`);
        await installPackages(nitroxPackages);
        await setTimeout(1000 * nitroxPackages.length);
        spinner.stop(`${gradient.atlas("Nitrox")} DevKit running.`);
    }
    await setTimeout(1000);
    prompt.outro(`You are now ready to ${gradient.atlas("Hit The Ground Running")}!`);

    return cliResults;
}
