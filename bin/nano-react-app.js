#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const download = require("download-git-repo");

const githubDownload = util.promisify(download);
const deleteFile = util.promisify(fs.unlink);

// grab arguments
const args = process.argv.slice(2);
let projectLocation = args[0] && args[0].trim();

console.log(`
${chalk.bgMagenta(chalk.cyanBright("  NANO REACT APP  "))}
`);

const main = async () => {
  // check that there is a project location provided
  if (!projectLocation) {
    console.log(chalk.red("Please specify a project location"));
    return;
  }

  // ascertain project path and name
  const projectPath = path.join(process.cwd(), projectLocation);
  const projectName =
    projectLocation === "."
      ? path.basename(projectPath)
      : path.basename(projectLocation);

  console.log(`  ${chalk.cyan("Project path: ") + projectPath}
  ${chalk.cyan("Project name: ") + projectName}
  `);

  // create folder if it does not exist
  const folderExists = fs.existsSync(projectPath);
  if (!folderExists) {
    process.stdout.write("  Creating directory...");
    fs.mkdirSync(projectPath, { recursive: true });
    process.stdout.write(chalk.green(" DONE\n"));
  }

  // download template project from github
  process.stdout.write("  Downloading template project...");
  await githubDownload("adrianmcli/nano-react-app-template", projectPath);
  process.stdout.write(chalk.green(" DONE\n\n"));

  // change package.json project name
  const pkgJsonPath = path.join(projectPath, "package.json");
  const packageJSON = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));

  const newPackageJSON = {
    ...packageJSON,
    name: projectName,
    description: "",
  };

  fs.writeFileSync(
    pkgJsonPath,
    JSON.stringify(newPackageJSON, null, 2),
    "utf8",
  );

  // delete unnecessary files
  await deleteFile(path.join(projectPath, "LICENSE"));
  await deleteFile(path.join(projectPath, "package-lock.json"));

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
};

main();
