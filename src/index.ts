#!usr/bin/env node

import { runCLI } from "./cli/index.js";
import { getUserPkgManager } from "./utils/getPackageManager.js";

const packageManager = getUserPkgManager()
await runCLI(packageManager);