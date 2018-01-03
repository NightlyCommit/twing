import TwingFunction from "../function";
import TwingFunctionOptions = require("../function-options");
import TwingEnvironment = require("../environment");
import TwingExtensionSandbox = require("../extension/sandbox");
import TwingErrorLoader from "../error/loader";

const merge = require('merge');

class TwingFunctionInclude extends TwingFunction {
    constructor(name: string) {
        let options: TwingFunctionOptions = {
            needs_environment: true,
            needs_context: true,
            is_safe: ['all']
        };

        let callable = function (env: TwingEnvironment, context: any, template: string | Array<string>, variables: any = {}, withContext: boolean = true, ignoreMissing: boolean = false, sandboxed: boolean = false) {
            let alreadySandboxed = false;
            let sandbox: TwingExtensionSandbox = null;

            if (withContext) {
                variables = merge(context, variables);
            }

            let isSandboxed = sandboxed;

            if (isSandboxed && env.hasExtension('TwingExtensionSandbox')) {
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
        };

        super(name, callable, options);
    }
}

export = TwingFunctionInclude;