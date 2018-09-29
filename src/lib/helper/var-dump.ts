import {iteratorToHash} from "./iterator-to-hash";
import {isTraversable} from "./is-traversable";

const locutusVarDump = require('locutus/php/var/var_dump');

export function varDump(thing: any): string {
    let result: string;
    let consoleLog = console.log;

    console.log = () => {
        // no-op to prevent varDump to log to the console
    };

    let thingToDump: any;

    if (isTraversable(thing)) {
        thingToDump = iteratorToHash(thing);
    }
    else {
        thingToDump = thing;
    }

    result = locutusVarDump(thingToDump);

    console.log = consoleLog;

    return result;
}
