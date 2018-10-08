import {TwingExtension} from "../extension";
import {TwingFunction} from "../function";
import {TwingEnvironment} from "../environment";
import {varDump} from "../helper/var-dump";
import {TwingOutputBuffering} from "../output-buffering";
import {each} from "../helper/each";
import {TwingTemplate} from "../template";

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
    if (!env.isDebug()) {
        return null;
    }

    TwingOutputBuffering.obStart();

    if (vars.length < 1) {
        let vars_: Map<any, any> = new Map();

        each(context, (key: any, value: any) => {
            if (!(value instanceof TwingTemplate)) {
                vars_.set(key, value);
            }
        });

        varDump(vars_);
    }
    else {
        varDump(...vars);
    }

    return TwingOutputBuffering.obGetClean();
}
