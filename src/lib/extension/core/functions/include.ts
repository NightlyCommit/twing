import {iteratorToMap} from "../../../helpers/iterator-to-map";
import {merge} from "../../../helpers/merge";
import {TwingErrorLoader} from "../../../error/loader";
import {TwingTemplate} from "../../../template";
import {isTraversable} from "../../../helpers/is-traversable";
import {TwingErrorRuntime} from "../../../error/runtime";
import {isNullOrUndefined} from "util";
import {isPlainObject} from "../../../helpers/is-plain-object";
import {TwingOutputBuffer} from "../../../output-buffer";
import {TwingContext} from "../../../context";
import {isMap} from "../../../helpers/is-map";

/**
 * Renders a template.
 *
 * @param {TwingTemplate} template
 * @param {TwingContext<any, any>} context
 * @param {TwingSource} from
 * @param {TwingOutputBuffer} outputBuffer
 * @param {string | Map<number, string | TwingTemplate>} templates The template to render or an array of templates to try consecutively
 * @param {any} variables The variables to pass to the template
 * @param {boolean} withContext
 * @param {boolean} ignoreMissing Whether to ignore missing templates or not
 * @param {boolean} sandboxed Whether to sandbox the template or not
 *
 * @returns {Promise<string>} The rendered template
 */
export function include(template: TwingTemplate, context: TwingContext<any, any>, outputBuffer: TwingOutputBuffer, templates: string | Map<number, string | TwingTemplate> | TwingTemplate, variables: any = {}, withContext: boolean = true, ignoreMissing: boolean = false, sandboxed: boolean = false): Promise<string> {
    let env = template.environment;
    let from = template.source;
    let alreadySandboxed = env.isSandboxed();

    if (!isPlainObject(variables) && !isTraversable(variables)) {
        return Promise.reject(new TwingErrorRuntime(`Variables passed to the "include" function or tag must be iterable, got "${!isNullOrUndefined(variables) ? typeof variables : variables}".`, -1, from));
    }

    variables = iteratorToMap(variables);

    if (withContext) {
        variables = merge(context, variables);
    }

    if (sandboxed) {
        if (!alreadySandboxed) {
            env.enableSandbox();
        }
    }

    if (!isMap(templates)) {
        templates = new Map([[0, templates]]);
    }

    let restoreSandbox = (): void => {
        if (sandboxed && !alreadySandboxed) {
            env.disableSandbox();
        }
    };

    let resolveTemplate = (templates: Map<number, string | TwingTemplate>): Promise<TwingTemplate> => {
        return env.resolveTemplate([...templates.values()], from).catch((e) => {
            restoreSandbox();

            if (e instanceof TwingErrorLoader) {
                if (!ignoreMissing) {
                    throw e;
                } else {
                    return null;
                }
            } else {
                throw e;
            }
        });
    };

    return resolveTemplate(templates).then((template) => {
        let promise = template ? template.render(variables, outputBuffer) : Promise.resolve('');

        return promise.then((result) => {
            restoreSandbox();

            return result;
        }).catch((e) => {
            restoreSandbox();

            throw e;
        });
    });
}
