import {TwingEnvironmentNode} from "../../../src/lib/environment/node";
import TestBase from "./TestBase";

const {resolve, relative} = require('path');
const finder = require('fs-finder');

let directory = resolve('test/tests/integration/fixtures');

let files = finder.from(directory).findFiles('*.ts');

type Module = {
    [key: string]: new (...args: any[]) => TestBase;
}

for (let file of files) {
    let module: Module = require(`${file}`);

    for (let key in module) {
        let Test = module[key];

        new Test(TwingEnvironmentNode, relative(directory, file)).run();
    }
}

