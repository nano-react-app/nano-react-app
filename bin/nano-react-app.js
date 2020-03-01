#!/usr/bin/env node
const chalk = require("chalk");
const funcs = require('./funcs');

const main = async () => {

    console.log(`${chalk.bgMagenta(chalk.cyanBright("  NANO REACT APP  "))}`);

    const arg = process.argv.slice(2)[0];
    const projectLocation = arg && arg.trim();
    await funcs.validateParams(projectLocation);
    const { projectPath, projectName } = await funcs.processParams(projectLocation);
    const templateLocation = "adrianmcli/nano-react-app-template";

    await funcs.createFolder(projectPath);
    await funcs.downloadTemplate(templateLocation, projectPath);
    await funcs.updateProjectFiles(projectPath, projectName);
    await funcs.notifyUser(projectPath, projectName);
};

main();
