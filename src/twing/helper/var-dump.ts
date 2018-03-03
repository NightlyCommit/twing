import {iteratorToHash} from "./iterator-to-hash";
import {isTraversable} from "./is-traversable";

const locutusVarDump = require('locutus/php/var/var_dump');

export function varDump(thing: any): string {
    let result: string;
    let consoleLog = console ? console.log : null;

    if (consoleLog) {
        console.log = function () {
            // no-op to prevent varDump to log to the console
            // todo: find a cleaner way
        };
    }

    let thingToDump: any;

    if (isTraversable(thing)) {
        thingToDump = iteratorToHash(thing);
    }
    else {
        thingToDump = thing;
    }

    result = locutusVarDump(thingToDump);

    if (consoleLog) {
        console.log = consoleLog;
    }

    return result;
}
