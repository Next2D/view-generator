#!/usr/bin/env node

"use strict";

const version = process.versions.node;
if (15 > version.split(".")[0]) {
    console.error(
        "You are running Node Version:" + version + ".\n" +
        "View Generator requires Node 14 or higher. \n" +
        "Please update your version of Node."
    );
    process.exit(1);
}

const chalk       = require("chalk");
const { Command } = require("commander");
const packageJson = require("./package.json");
const path        = require("path");
const fs          = require("fs-extra");

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

        const names = keys[idx].split("-");

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

            fs.writeFileSync(viewFile, `import { View } from "@next2d/framework";

/**
 * @class
 * @extends {View}
 */
export class ${name}View extends View
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

            fs.writeFileSync(viewModelFile, `import { ViewModel } from "@next2d/framework";

/**
 * @class
 * @extends {ViewModel}
 */
export class ${name}ViewModel extends ViewModel
{    
    /**
     * @param  {View} view
     * @return {void}
     * @method
     * @public
     */
    unbind (view)
    {
        console.log(view);
    }

    /**
     * @param  {View} view
     * @return {Promise}
     * @method
     * @public
     */
    bind (view)
    {
        return this
            .factory(view)
            .then((view) => 
            {
                return Promise.resolve(view);
            });
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
    new Command()
        .name(packageJson.name)
        .description("Generate the View, ViewModel class required for routing.")
        .version(packageJson.version)
        .parse(process.argv);

    createFile();
};

exec();
