import { exec } from "child_process";
import { PackageID, type Packages, packages } from "./index.js";

export async function installPackages(extensions: Packages[]) {
    extensions.forEach(element => {
        let elementID: PackageID = packages[element]
        exec(`code --install-extension ${elementID}`)
    });
}