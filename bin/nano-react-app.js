#!/usr/bin/env node
const chalk = require("chalk");
const funcs = require('./funcs');

const jsxPath = 'adrianmcli/nano-react-app-template';
const tsxPath = 'adrianmcli/nano-react-app-typescript-template';

const main = async () => {

    console.log(`${chalk.bgMagenta(chalk.cyanBright("  NANO REACT APP  "))}`);

    const args = require('yargs').argv;
    const projectLocation = args._[0];
    const projectType = args.tsx? 'tsx': 'jsx';

    await funcs.validateParams(projectLocation);
    const { projectPath, projectName } = await funcs.processParams(projectLocation);
    const templateLocation = projectType === 'tsx'? tsxPath: jsxPath;

    await funcs.createFolder(projectPath);
    await funcs.downloadTemplate(templateLocation, projectPath);
    await funcs.updateProjectFiles(projectPath, projectName);
    await funcs.notifyUser(projectPath, projectName);
};

main();
