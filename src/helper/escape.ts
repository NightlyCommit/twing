import {TwingMarkup} from "../markup";
import {TwingEnvironment} from "../environment";
import {TwingMap} from "../map";
import {TwingErrorRuntime} from "../error/runtime";

/**
 * Escapes a string.
 *
 * Implemented as a helper since it's needed by the test suite. May change in the future.
 *
 * @param TwingEnvironment $env
 * @param mixed            $string     The value to be escaped
 * @param string           $strategy   The escaping strategy
 * @param string           $charset    The charset
 * @param bool             $autoescape Whether the function is called by the auto-escaping feature (true) or by the developer (false)
 *
 * @returns {string}
 */
export function escape(env: TwingEnvironment, string: any, strategy: string = 'html', charset: string = null, autoescape: boolean = false) {
    const htmlspecialchars = require('htmlspecialchars');
    const secureFilters = require('secure-filters');
    const array_merge = require('locutus/php/array/array_merge');

    if (autoescape && string instanceof TwingMarkup) {
        return string;
    }

    if (typeof string !== 'string') {
        if (string && (typeof string === 'object') && Reflect.has(string, 'toString')) {
            string = '' + string;
        }
        else if (['html', 'js', 'css', 'html_attr', 'url'].includes(strategy)) {
            return string;
        }
    }

    switch (strategy) {
        case 'html':
            return htmlspecialchars(string);
        case 'js':
            return secureFilters.js(string);
        case 'css':
            return secureFilters.css(string);
        case 'html_attr':
            return secureFilters.html(string);
        default:
            let coreExtension = env.getCoreExtension();
            let escapers: TwingMap<string, Function> = coreExtension.getEscapers();

            if (escapers.has(strategy)) {
                return escapers.get(strategy)(env, string, charset);
            }

            let validStrategies: Array<string> = array_merge(['html', 'js', 'url', 'css', 'html_attr'], [...escapers.keys()]);

            throw new TwingErrorRuntime(`Invalid escaping strategy "${strategy}" (valid ones: ${validStrategies.join(', ')}).`);
    }
}
