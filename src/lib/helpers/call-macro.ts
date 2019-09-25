import {TwingTemplate} from "../template";
import {TwingContext} from "../context";
import {TwingSource} from "../source";
import {TwingErrorRuntime} from "../error/runtime";

export function callMacro(template: TwingTemplate, method: string, args: any[], lineno: number, context: TwingContext<any, any>, source: TwingSource) {
    let getCallable: Function = (template: any) => {
        let candidate: any = template[method];

        if (candidate && (typeof candidate === 'function')) {
            return candidate;
        }

        return null;
    };

    let callable: Function = null;
    let parent: any = template;
    let done: boolean = false;

    while (!done) {
        callable = getCallable(parent);

        done = (callable !== null) || ((parent = parent.getParent(context)) === false);
    }

    if (!callable) {
        throw new TwingErrorRuntime(`Macro "${method.substr('macro_'.length)}" is not defined in template "${template.getTemplateName()}".`, lineno, source);
    }

    return callable.call(template, ...args);
}
