import {TwingEnvironment} from "../../../environment";
import {TwingSource} from "../../../source";
import {TwingErrorLoader} from "../../../error/loader";
import {TwingTemplate} from "../../../template";

/**
 * Returns a template content without rendering it.
 *
 * @param {TwingTemplate} template
 * @param {string} name The template name
 * @param {boolean} ignoreMissing Whether to ignore missing templates or not
 *
 * @return {Promise<string>} The template source
 */
export function source(template: TwingTemplate, name: string, ignoreMissing: boolean = false): Promise<string> {
    let env = template.environment;
    let from = template.source;

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
