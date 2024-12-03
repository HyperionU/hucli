import * as prompt from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { cliResults, Packages } from "~/installers/index.js";
import gradient from "gradient-string";
import { installPackages } from "~/installers/installPackage.js";
import { setTimeout } from "timers/promises";
import { packagePrompt, install, configPrompt} from "~/utils/prompts.js";
import { PackageManager } from "~/utils/getPackageManager.js";
import { turboCLI } from "./turbo.js";
import { version } from "../../package.json";
import { nitroxCLI } from "./nitrox.js";
import { Task, tasks } from "~/utils/task.js";

const defaultOptions: cliResults = {
    flags: {
        default: false,
        nitrox: false,
        turbo: false,
    },
    packages: ["vsIcons", "night", "marp", "ghActions"]
}

const nitroxPackages: Packages[] = [
    "Astro",
    "Tailwind"
]

export const runCLI = async (packageManager: PackageManager): Promise<cliResults> => {
    const cliResults = defaultOptions;

    const program = new Command()
    .name("huCLI")
    .description("The easiest way to configure your development environment to UofH Standards.")
    .version(chalk.grey(version))

    program
    .option(
        "--ntrx, --nitrox", 
        "Runs the new Nitrox bootstrapper.", 
        false
    )
    .option(
        "-t, --turbo", 
        "Bootstrap a Turbo monorepo.", 
        false
    )
    .option(
        "-y, --default",
        "Skip the CLI and bootstrap a new environment using defaults.",
        false
    )
    
    program.parse(process.argv);

    cliResults.flags = program.opts();

    if (cliResults.flags.default){
        return cliResults;
    }

    prompt.intro(gradient.atlas("HUCLI"));
    await setTimeout(1000)
    prompt.note("Let's get you configured.", gradient.atlas("Step 1:"))

    const config = await configPrompt(packageManager, cliResults.flags)
    
    config.nitrox && (cliResults.flags.nitrox = true);
    config.turbo && (cliResults.flags.turbo = true);

    const packageSet = await packagePrompt();
    const packages: Packages[] = await install(packageSet)
    cliResults.flags.nitrox && nitroxPackages.forEach(item => {
        packages.push(item);
    })

    cliResults.packages = packages;

    const taskSet: Task[] = [
        {
            title: 'Installing Extensions',
            async task() {
                await installPackages(packages);
                await setTimeout(1000 * packages.length);
                return `${gradient.atlas("Extensions installed.")}`;
            },
            enabled: packageSet != "skip"
        },
        {
            title: 'Starting Turbo',
            async task() {
                await setTimeout(1000)
                return `${gradient.passion("Turbo")} running.`;
            },
            enabled: cliResults.flags.turbo
        },
        {
            title: 'Starting Nitrox DevKit',
            async task() {
                await setTimeout(1000)
                return `${gradient.atlas("Nitrox")} DevKit running.`;
            },
            enabled: cliResults.flags.nitrox
        },   
    ]

    await tasks(taskSet);

    if (cliResults.flags.turbo) {
        await setTimeout(1000)
        await turboCLI(packageManager)
    }

    if (cliResults.flags.nitrox) {
        await setTimeout(2000)
        await nitroxCLI(packageManager, cliResults.flags)
    }
    await setTimeout(1000);

    prompt.outro(`You are now ready to ${gradient.atlas("Hit The Ground Running")}!`);

    return cliResults;
}
