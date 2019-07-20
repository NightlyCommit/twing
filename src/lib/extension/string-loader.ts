import {TwingExtension} from "../extension";
import {TwingFunction} from "../function";
import {TwingEnvironment} from "../environment";
import {TwingTemplate} from "../template";

export class TwingExtensionStringLoader extends TwingExtension {
    getFunctions() {
        return new Map([
            [0, new TwingFunction('template_from_string', twingTemplateFromString, {needs_environment: true})],
        ]);
    }
}

/**
 * Loads a template from a string.
 *
 * <pre>
 * {{ include(template_from_string("Hello {{ name }}")) }}
 * </pre>
 *
 * @param {TwingEnvironment} env A TwingEnvironment instance
 * @param {string} template A template as a string or object implementing toString()
 * @param {string} name An optional name for the template to be used in error messages
 *
 * @returns TwingTemplate
 */
export function twingTemplateFromString(env: TwingEnvironment, template: string, name: string = null): TwingTemplate {
    return env.createTemplate(template, name);
}
