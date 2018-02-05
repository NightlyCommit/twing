import TwingExtension from "../extension";
import TwingNodeVisitorEscaper from "../node-visitor/escaper";
import TwingTokenParserAutoEscape from "../token-parser/auto-escape";
import TwingFileExtensionEscapingStrategy from "../file-extension-escaping-strategy";
import TwingFilter from "../filter";

class TwingExtensionEscaper extends TwingExtension {
    private defaultStrategy: string | boolean | Function;

    /**
     * @param {string} defaultStrategy An escaping strategy
     */
    constructor(defaultStrategy: string | boolean | Function = 'html') {
        super();

        this.setDefaultStrategy(defaultStrategy);
    }

    getTokenParsers() {
        return [
            new TwingTokenParserAutoEscape()
        ];
    }

    getNodeVisitors() {
        return [
            new TwingNodeVisitorEscaper()
        ];
    }

    getFilters() {
        return [
            new TwingFilter('raw', twingRawFilter, {
                is_safe: ['all']
            }),
        ];
    }

    /**
     * Sets the default strategy to use when not defined by the user.
     *
     * The strategy can be a valid PHP callback that takes the template
     * name as an argument and returns the strategy to use.
     *
     * @param {string|boolean|Function} defaultStrategy An escaping strategy
     */
    setDefaultStrategy(defaultStrategy: string | boolean | Function)
    {
        if (defaultStrategy === 'name') {
            defaultStrategy = TwingFileExtensionEscapingStrategy.guess;
        }

        this.defaultStrategy = defaultStrategy;
    }

    /**
     * Gets the default strategy to use when not defined by the user.
     *
     * @param {string|boolean} name The template name
     *
     * @returns {string|false} The default strategy to use for the template
     */
    getDefaultStrategy(name: string | boolean): string {
        let result: string;

        // disable string callables to avoid calling a function named html or js,
        // or any other upcoming escaping strategy
        if (typeof this.defaultStrategy === 'function') {
            return this.defaultStrategy(name);
        }

        result = this.defaultStrategy as string;

        return result;
    }
}

/**
 * Marks a variable as being safe.
 *
 * @param string $string A PHP variable
 *
 * @return string
 */
export function twingRawFilter(value: string) {
    return value;
}

export default TwingExtensionEscaper;