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
const path        = require("path");
const fs = require("fs-extra");

/**
 * @return {void}
 */
const createFile = function ()
{

    console.log();
    console.log(`${chalk.green("Begin research.")}`);
    console.log();

    const cwd = `${process.cwd()}/src/`;

    const routingPath = path.join(cwd, "config/routing.json");
    if (!fs.existsSync(routingPath)) {
        console.log(`${chalk.red("Could not find routing.json.")}`);
        console.log();
        return ;
    }

    const routing = require(routingPath);
    const keys = Object.keys(routing);

    for (let idx = 0; idx < keys.length; ++idx) {

        const names = keys[idx].split(/[-_/]/);

        if (names[0].charAt(0) === "@") {
            continue;
        }

        const viewDir = path.join(cwd, `view/${names[0]}`);
        if (!fs.existsSync(viewDir)) {

            console.log(`${chalk.green(`Create a new Directory ${viewDir}.`)}`);
            console.log();

            fs.ensureDirSync(viewDir);
        }

        let name = "";
        for (let idx = 0; names.length > idx; ++idx) {

            const base = names[idx];

            name += base
                .charAt(0)
                .toUpperCase() + base.slice(1);

        }

        // create View file
        const viewFile = path.join(viewDir, `${name}View.js`);
        if (!fs.existsSync(viewFile)) {

            console.log(`Create a new View Class ${viewFile}.`);
            console.log();

            fs.writeFileSync(viewFile, `/**
 * @class
 * @extends {next2d.fw.View}
 */
export class ${name}View extends next2d.fw.View
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();
    }
}`);
        }

        // create ViewModel file
        const viewModelFile = path.join(viewDir, `${name}ViewModel.js`);
        if (!fs.existsSync(viewModelFile)) {

            console.log(`Create a new ViewModel Class ${viewModelFile}.`);
            console.log();

            fs.writeFileSync(viewModelFile, `/**
 * @class
 * @extends {next2d.fw.ViewModel}
 */
export class ${name}ViewModel extends next2d.fw.ViewModel
{
    /**
     * @param {next2d.fw.View} view
     * @constructor
     * @public
     */
    constructor (view)
    {
        super(view);
    }

    /**
     * @param  {next2d.fw.View} view
     * @return {Promise|void}
     * @public
     */
    bind (view)
    {
        return this.factory();
    }
}`);
        }
    }

    console.log(`${chalk.green("Finished.")}`);
    console.log();
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
