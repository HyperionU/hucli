import { PackageID, type Packages, packages } from "./index.js";
import { execa } from "execa";

export async function installPackages(extensions: Packages[]) {
    extensions.forEach(element => {
        let elementID: PackageID = packages[element]
        execa`code --install-extension ${elementID}`
    });
}