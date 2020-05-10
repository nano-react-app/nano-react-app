#!/usr/bin/env node
const chalk = require("chalk");
const funcs = require("./funcs");

const templates = {
  js: `nano-react-app/template-js`,
  ts: `nano-react-app/template-ts`,
};

const main = async () => {
  console.log(`${chalk.bgMagenta(chalk.cyanBright("  NANO REACT APP  "))}`);

  const args = require("yargs").argv;
  const projectLocation = args._[0];
  const projectType = args.ts ? "ts" : "js";

  await funcs.validateParams(projectLocation);
  const { projectPath, projectName } = await funcs.processParams(
    projectLocation,
  );
  const templateLocation = projectType === "ts" ? templates.ts : templates.js;

  await funcs.createFolder(projectPath);
  await funcs.downloadTemplate(templateLocation, projectPath);
  await funcs.updateProjectFiles(projectPath, projectName);
  await funcs.notifyUser(projectPath, projectName);
};

main();
