#!/usr/bin/env node

console.log("This is the Nano React App CLI!");

const args = process.argv.slice(2);
const appName = args[0].trim()
const unpackCurrentFolder = appName === "."

