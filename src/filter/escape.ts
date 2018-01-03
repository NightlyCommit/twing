import TwingFilter from "../filter";
import TwingEnvironment = require("../environment");
import TwingMarkup = require("../markup");
import TwingFilterOptions = require("../filter-options");
import TwingNode from "../node";
import TwingNodeExpressionConstant from "../node/expression/constant";
import TwingMap from "../map";
import TwingErrorRuntime from "../error/runtime";
import TwingExtensionCore from "../extension/core";

const htmlspecialchars = require('htmlspecialchars');
const secureFilters = require('secure-filters');

const array_merge = require('locutus/php/array/array_merge');

class TwingFilterEscape extends TwingFilter {
    constructor(name: string) {
        let callable = function(env: TwingEnvironment, string: any, strategy: string = 'html', charset: string = null, autoescape: boolean = false) {
            if (string instanceof TwingMarkup) {
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
                default:
                    // todo: service-pattern violation by TwigPHP
                    let coreExtension = env.getExtension('TwingExtensionCore') as TwingExtensionCore;
                    let escapers: TwingMap<string, Function> = coreExtension.getEscapers();

                    if (escapers.has(strategy)) {
                        return escapers.get(strategy)(env, string, charset);
                    }

                    let validStrategies: Array<string> = array_merge(['html', 'js', 'url', 'css', 'html_attr'], [...escapers.keys()]);

                    throw new TwingErrorRuntime(`Invalid escaping strategy "${strategy}" (valid ones: ${validStrategies.join(', ')}).`);
            }
        };

        let options: TwingFilterOptions = {
            needs_environment: true,
            is_safe_callback: function(filterArgs: TwingNode) {
                if (filterArgs.getNodes().length() > 0) {
                    let result: Array<string> = [];

                    filterArgs.getNodes().forEach(function(arg) {
                        if (arg instanceof TwingNodeExpressionConstant) {
                            result = [arg.getAttribute('value')];
                        }
                    });

                    return result;
                }
                else {
                    return ['html'];
                }
            }
        };

        super(name, callable, options);
    }
}

export = TwingFilterEscape;