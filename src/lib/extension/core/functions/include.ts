import {iteratorToMap} from "../../../helpers/iterator-to-map";
import {merge} from "../../../helpers/merge";
import {TwingErrorLoader} from "../../../error/loader";
import {TwingEnvironment} from "../../../environment";
import {TwingSource} from "../../../source";

/**
 * Renders a template.
 *
 * @param {TwingEnvironment} env
 * @param {Map<*,*>} context
 * @param {TwingSource} source
 * @param {string|Array<string>} template The template to render or an array of templates to try consecutively
 * @param variables The variables to pass to the template
 * @param {boolean} withContext
 * @param {boolean} ignoreMissing Whether to ignore missing templates or not
 * @param {boolean} sandboxed Whether to sandbox the template or not
 *
 * @returns {string} The rendered template
 */
export function twingFunctionInclude(env: TwingEnvironment, context: Map<any, any>, source: TwingSource, template: string | Array<string>, variables: any = {}, withContext: boolean = true, ignoreMissing: boolean = false, sandboxed: boolean = false): string {
    let alreadySandboxed = env.isSandboxed();

    variables = iteratorToMap(variables);

    if (withContext) {
        variables = merge(context, variables);
    }

    if (sandboxed) {
        if (!alreadySandboxed) {
            env.enableSandbox();
        }
    }

    let result = '';

    try {
        result = env.resolveTemplate(template, source).render(variables);
    }
    catch (e) {
        if (e instanceof TwingErrorLoader) {
            if (!ignoreMissing) {
                if (sandboxed && !alreadySandboxed) {
                    env.disableSandbox();
                }

                throw e;
            }
        }
        else {
            if (sandboxed && !alreadySandboxed) {
                env.disableSandbox();
            }

            throw e;
        }
    }

    if (sandboxed && !alreadySandboxed) {
        env.disableSandbox();
    }

    return result;
}
