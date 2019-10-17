import {TwingEnvironment} from "../../../environment";
import {TwingSource} from "../../../source";
import {TwingErrorLoader} from "../../../error/loader";

/**
 * Returns a template content without rendering it.
 *
 * @param {TwingEnvironment} env
 * @param {TwingSource} from
 * @param {string} name The template name
 * @param {boolean} ignoreMissing Whether to ignore missing templates or not
 *
 * @return {Promise<string>} The template source
 */
export function source(env: TwingEnvironment, from: TwingSource, name: string, ignoreMissing: boolean = false): Promise<string> {
    return env.getLoader().getSourceContext(name, from).then((source) => {
        return source.getCode();
    }).catch((e) => {
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
}
