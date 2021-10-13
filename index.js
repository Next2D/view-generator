#!/usr/bin/env node

"use strict";

const version = process.versions.node;
if (10 > version.split(".")[0]) {
    console.error(
        "You are running Node Version:" + version + ".\n" +
        "Create Next2d App requires Node 10 or higher. \n" +
        "Please update your version of Node."
    );
    process.exit(1);
}

const chalk       = require("chalk");
const commander   = require("commander");
const packageJson = require("./package.json");

/**
 * @return {void}
 */
const createFile = function ()
{
    console.log("koko");
};

/**
 * @return {void}
 */
const exec = function ()
{
    new commander.Command(packageJson.name)
        .version(packageJson.version)
        .arguments("<project-directory>")
        .usage(`${chalk.green("<project-directory>")} [options]`)
        .on("--help", () =>
        {
            console.log();
            console.log(
                "    If you have any problems, do not hesitate to file an issue:"
            );
            console.log(
                `      ${chalk.cyan(
                    "https://github.com/Next2D/next2d-view-generator/issues/new"
                )}`
            );
            console.log();
        })
        .parse(process.argv);

    createFile();
};

exec();
