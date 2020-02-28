#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const download = require("download-git-repo");
const githubDownload = util.promisify(download);
const deleteFile = util.promisify(fs.unlink);

exports.processParams = async (projectLocation) => {
    const projectPath = path.join(process.cwd(), projectLocation);
    const projectName = projectLocation === "." ? path.basename(projectPath) : path.basename(projectLocation);
    return { projectPath, projectName };
}

exports.validateParams = async(projectLocation) => {
    // check that there is a project location provided
    if (!projectLocation) {
        console.log(`  Please specify a project directory:
    ${chalk.cyan("nano-react-app")} ${chalk.green("<project-directory>")}

  For example:
    ${chalk.cyan("nano-react-app")} ${chalk.green("my-react-app")}
    `);
        return false;
    }
    return true;
}

exports.createFolder = async (projectPath) => {
    // create folder if it does not exist
    const folderExists = fs.existsSync(projectPath);
    if (!folderExists) {
        process.stdout.write("  Creating directory...");
        fs.mkdirSync(projectPath, { recursive: true });
        process.stdout.write(chalk.green(" DONE\n"));
    }
}

exports.downloadTemplate = async (templateUrl, projectPath) => {
    // download template project from github
    process.stdout.write("  Downloading template project...");
    await githubDownload(templateUrl, projectPath);
    process.stdout.write(chalk.green(" DONE\n\n"));
}

exports.updateProjectFiles = async (projectPath, projectName) => {

    // change package.json project name
    const pkgJsonPath = path.join(projectPath, "package.json");
    const packageJSON = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
    const newPackageJSON = { ...packageJSON, name: projectName, description: "", };

    fs.writeFileSync(pkgJsonPath, JSON.stringify(newPackageJSON, null, 2), "utf8");

    // delete unnecessary files
    await deleteFile(path.join(projectPath, "LICENSE"));
    //await deleteFile(path.join(projectPath, "package-lock.json"));
}

exports.notifyUser = async (projectPath, projectName) => {
    // notify user that the app is ready
    console.log(`${chalk.bgMagenta(chalk.cyanBright("  SUCCESS!  "))}

  Created project ${chalk.magenta(projectName)} at ${chalk.magenta(projectPath)}
  Navigate to that directory and run the following commands:

    1. ${chalk.cyan("npm install")} or ${chalk.cyan(
        "yarn",
    )} to install dependencies

    2. ${chalk.cyan("npm start")} or ${chalk.cyan(
        "yarn start",
    )} to start developing

  ${chalk.yellow("Enjoy!")}
`);
}
