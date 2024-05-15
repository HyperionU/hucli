#!usr/bin/env node

import path from "path";
import fs from "fs-extra";
import { runCLI } from "./cli";

const main = async () => {
    const { flags } = await runCLI();
    
}