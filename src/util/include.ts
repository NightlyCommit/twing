import TwingEnvironment from "../environment";
import TwingExtensionSandbox from "../extension/sandbox";
import TwingErrorLoader from "../error/loader";

const merge = require('merge');

/**
 * Renders a template.
 *
 * @param {TwingEnvironment} env
 * @param context
 * @param {string|Array<string>} template The template to render or an array of templates to try consecutively
 * @param variables The variables to pass to the template
 * @param {boolean} withContext
 * @param {boolean} ignoreMissing Whether to ignore missing templates or not
 * @param {boolean} sandboxed Whether to sandbox the template or not
 *
 * @returns {string} The rendered template
 */
export default function twingInclude(env: TwingEnvironment, context: any, template: string | Array<string>, variables: any = {}, withContext: boolean = true, ignoreMissing: boolean = false, sandboxed: boolean = false) {
    let alreadySandboxed = false;
    let sandbox: TwingExtensionSandbox = null;

    if (withContext) {
        variables = merge(context, variables);
    }

    let isSandboxed = sandboxed && env.hasExtension('TwingExtensionSandbox');

    if (isSandboxed) {
        sandbox = env.getExtension('TwingExtensionSandbox') as TwingExtensionSandbox;

        if (!(alreadySandboxed = sandbox.isSandboxed())) {
            sandbox.enableSandbox();
        }
    }

    let result = null;

    try {
        result = env.resolveTemplate(template).render(variables);
    }
    catch (e) {
        if (e instanceof TwingErrorLoader) {
            if (!ignoreMissing) {
                if (isSandboxed && !alreadySandboxed) {
                    sandbox.disableSandbox();
                }

                throw e;
            }
        }
        else {
            if (isSandboxed && !alreadySandboxed) {
                sandbox.disableSandbox();
            }

            throw e;
        }
    }

    if (isSandboxed && !alreadySandboxed) {
        sandbox.disableSandbox();
    }

    return result;
}