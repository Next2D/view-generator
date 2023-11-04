#!/usr/bin/env node

"use strict";

import pc from "picocolors";
import path from "path";
import fs from "fs";

const recommendeVersion: number = 18;
const version: string = process.versions.node;
if (recommendeVersion > parseInt(version.split(".")[0])) {
    pc.red(`You are running Node Version:${version}.
View Generator requires Node ${recommendeVersion} or higher.
Please update your version of Node.`);
    process.exit(1);
}

/**
 * @params {string} dir
 * @return {void}
 * @method
 * @public
 */
const createDirectory = (dir: string): void =>
{
    if (!fs.existsSync(dir)) {

        console.log(`${pc.green(`Create a new Directory ${dir}.`)}`);
        console.log();

        // create new dir.
        fs.mkdirSync(dir, { "recursive": true });
    }
};

/**
 * @params {string} name
 * @return {string}
 * @method
 * @public
 */
const createViewFileForJavaScript = (name: string): string =>
{
    return `import { View } from "@next2d/framework";

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
}`;
};

/**
 * @params {string} name
 * @return {string}
 * @method
 * @public
 */
const createViewModelFileForJavaScript = (name: string): string =>
{
    return `import { ViewModel } from "@next2d/framework";

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
}`;
};

/**
 * @params {string} name
 * @return {string}
 * @method
 * @public
 */
const createViewFileForTypeScript = (name: string): string =>
{
    return `import { View } from "@next2d/framework";

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
}`;
};

/**
 * @params {string} name
 * @return {string}
 * @method
 * @public
 */
const createViewModelFileForTypeScript = (name: string): string =>
{
    return `import { View, ViewModel } from "@next2d/framework";

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
    unbind (view: View): void
    {
        console.log(view);
    }

    /**
     * @param  {View} view
     * @return {Promise}
     * @method
     * @public
     */
    bind (view: View): Promise<View>
    {
        return this
            .factory(view)
            .then((view): Promise<View> =>
            {
                return Promise.resolve(view);
            });
    }
}`;
};

/**
 * @return {void}
 * @method
 * @public
 */
const execute = (): void =>
{

    console.log(pc.green("Generate the View, ViewModel class required for routing."));
    console.log();
    console.log(pc.green("Begin research."));
    console.log();

    const cwd: string = `${process.cwd()}/src/`;

    const routingPath: string = path.join(cwd, "config/routing.json");
    if (!fs.existsSync(routingPath)) {
        console.log(pc.red("Could not find routing.json."));
        console.log();
        return ;
    }

    const useTypeScript: boolean = fs.existsSync(`${process.cwd()}/src/index.ts`);
    const ext: string = useTypeScript ? "ts" : "js";

    const routing: any = JSON.parse(
        fs.readFileSync(routingPath, { "encoding": "utf8" })
    );

    const keys: string[] = Object.keys(routing);
    for (let idx: number = 0; idx < keys.length; ++idx) {

        const names: string[] = keys[idx].split(/-|\//);

        if (names[0].charAt(0) === "@") {
            continue;
        }

        const viewDir: string = path.join(cwd, `view/${names[0]}`);
        createDirectory(viewDir);

        let name: string = "";
        for (let idx: number = 0; names.length > idx; ++idx) {

            const base: string = names[idx];

            name += base
                .charAt(0)
                .toUpperCase() + base.slice(1);

        }

        // create View file
        const viewFile: string = path.join(viewDir, `${name}View.${ext}`);
        if (!fs.existsSync(viewFile)) {

            console.log(`Create a new View Class ${viewFile}.`);
            console.log();

            fs.writeFileSync(viewFile, useTypeScript
                ? createViewFileForTypeScript(name)
                : createViewFileForJavaScript(name)
            );
        }

        // create ViewModel file
        const viewModelFile: string = path.join(viewDir, `${name}ViewModel.${ext}`);
        if (!fs.existsSync(viewModelFile)) {

            console.log(`Create a new ViewModel Class ${viewModelFile}.`);
            console.log();

            fs.writeFileSync(viewModelFile, useTypeScript
                ? createViewModelFileForTypeScript(name)
                : createViewModelFileForJavaScript(name)
            );
        }
    }

    console.log(pc.green("Finished."));
    console.log();
};

execute();
