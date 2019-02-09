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

console.log();
console.log(chalk.bgMagenta(chalk.cyanBright("  NANO REACT APP  ")));
console.log();

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

  console.log(chalk.cyanBright("Project path: ") + projectPath);
  console.log(chalk.cyanBright("Project name: ") + projectName);
  console.log();

  // create folder if it does not exist
  const folderExists = fs.existsSync(projectPath);
  if (!folderExists) {
    console.log("Creating directory...");
    fs.mkdirSync(projectPath, { recursive: true });
    console.log(chalk.cyanBright("Directory created."));
    console.log();
  }

  // download template project from github
  console.log("Downloading template project...");
  await githubDownload("adrianmcli/nano-react-app-template", projectPath);

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
  console.log(chalk.cyanBright("Project downloaded."));
  console.log();

  // notify user that the app is ready
  console.log(chalk.bgMagenta(chalk.cyanBright("  YOUR APP IS READY!  ")));
  console.log();
  console.log(
    `1) Install your dependencies with ${chalk.cyanBright("npm install")}`,
  );
  console.log();
  console.log(
    `2) Start developing your app with ${chalk.cyanBright("npm start")}`,
  );
  console.log();
  console.log(chalk.yellow("Enjoy!"));
  console.log();
};

main();
