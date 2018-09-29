import {TwingExtension} from "../extension";
import {TwingFunction} from "../function";
import {TwingEnvironment} from "../environment";
import {varDump} from "../helper/var-dump";

export class TwingExtensionDebug extends TwingExtension {
    getFunctions() {
        return new Map([
            [0, new TwingFunction('dump', twingVarDump, {
                is_safe: ['html'],
                needs_context: true,
                needs_environment: true
            })],
        ]);
    }
}

export function twingVarDump(env: TwingEnvironment, context: any, ...vars: Array<any>) {
    let parts: Array<string> = [];

    if (!env.isDebug()) {
        return null;
    }

    if (vars.length < 1) {
        // dump the whole context
        return varDump(context);
    }

    for (let var_ of vars) {
        parts.push(varDump(var_));
    }

    parts.push('');

    return parts.join('\n');
}
