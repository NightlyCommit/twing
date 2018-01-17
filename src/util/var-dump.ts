import TwingEnvironment from "../environment";

const varDump = require('locutus/php/var/var_dump');

let doVarDump = function(thing: any): string {
    let result: string;
    let consoleLog = console ? console.log : null;

    if (consoleLog) {
        console.log = function() {
            // no-op to prevent varDump to log to the console
            // todo: find a cleaner way
        };
    }

    result = varDump(thing);

    if (consoleLog) {
        console.log = consoleLog;
    }

    return result;
};

export default function twingVarDump(env: TwingEnvironment, context: any, ...vars: Array<any>) {
    let parts: Array<string> = [];

    if (!env.isDebug()) {
        return null;
    }

    if (vars.length < 1) {
        // dump the whole context
        return doVarDump(context);
    }

    for (let var_ of vars) {
        parts.push(doVarDump(var_));
    }

    parts.push('');

    return parts.join('\n');
}