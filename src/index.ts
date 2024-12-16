#!/usr/bin/env node

import chalk from "chalk";
import { runCLI } from "./cli/index.js";
import { cliFlags } from "./installers/index.js";
import { getUserPkgManager } from "./utils/getPackageManager.js";
import { Command } from "commander";
import { version } from "../package.json";


const program = new Command()
    .name("huCLI")
    .description("The easiest way to configure your development environment to UofH Standards.")
    .version(chalk.grey(version))

program
    .option(
        "--ntrx, --nitrox",
        `Runs the new Nitrox bootstrapper. ${chalk.bgRedBright("EXPERIMENTAL")}`,
        false
    )
    .option(
        "-t, --turbo",
        `Bootstrap a Turbo monorepo. ${chalk.bgRedBright("EXPERIMENTAL")}`,
        false
    )
    .option(
        "-y, --default",
        "Skip the CLI and bootstrap a new environment using defaults.",
        false
    )

const flags: cliFlags = program.parse(process.argv).opts();

const packageManager = getUserPkgManager()
await runCLI(packageManager, flags);