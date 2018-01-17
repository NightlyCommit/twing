import TwingEnvironment from "../environment";
import TwingErrorLoader from "../error/loader";

/**
 * Returns a template content without rendering it.
 *
 * @param {TwingEnvironment} env
 * @param {string} name The template name
 * @param {boolean} ignoreMissing Whether to ignore missing templates or not
 *
 * @return string The template source
 */
export default function twingSource(env: TwingEnvironment, name: string, ignoreMissing: boolean = false) {
    let loader = env.getLoader();

    try {
        return loader.getSourceContext(name).getCode();
    }
    catch (e) {
        if (e instanceof TwingErrorLoader && !ignoreMissing) {
            throw e;
        }

        throw e;
    }
}