/**
 * Loads a template from a string.
 *
 * <pre>
 * {{ include(template_from_string("Hello {{ name }}")) }}
 * </pre>
 *
 * @param {TwingEnvironment} env A TwingEnvironment instance
 * @param {string} template A template as a string or object implementing toString()
 *
 * @returns TwingTemplate
 */
import {TwingEnvironment} from "../../../environment";
import {TwingTemplate} from "../../../template";

export function twingFunctionTemplateFromString(env: TwingEnvironment, template: string): TwingTemplate {
    return env.createTemplate(template);
}
