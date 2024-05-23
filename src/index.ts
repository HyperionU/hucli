#!usr/bin/env node

import { runCLI } from "./cli/index.js";
import { installPackages } from "./installers/installPackage.js";

const main = async () => {
    const { flags, packages } = await runCLI();

    console.log(flags, packages)

    /* await installPackages(packages); */

}

await main();