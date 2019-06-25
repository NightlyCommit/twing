import {TwingEnvironment} from "../../../environment";
import {TwingSource} from "../../../source";
import {TwingErrorLoader} from "../../../error/loader";

/**
 * Returns a template content without rendering it.
 *
 * @param {TwingEnvironment} env
 * @param {TwingSource} source
 * @param {string} name The template name
 * @param {boolean} ignoreMissing Whether to ignore missing templates or not
 *
 * @return string The template source
 */
export function twingFunctionSource(env: TwingEnvironment, source: TwingSource, name: string, ignoreMissing: boolean = false) {
    let loader = env.getLoader();

    try {
        return loader.getSourceContext(name, source).getCode();
    } catch (e) {
        if (e instanceof TwingErrorLoader) {
            if (!ignoreMissing) {
                throw e;
            }
        } else {
            throw e;
        }
    }

    return null;
}
