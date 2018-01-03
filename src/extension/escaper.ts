import TwingExtension from "../extension";
import TwingNodeVisitorEscaper = require("../node-visitor/escaper");
import TwingTokenParserAutoEscape from "../token-parser/auto-escape";
import TwingFilterRaw = require("../filter/raw");

class TwingExtensionEscaper extends TwingExtension {
    private defaultStrategy: string;

    /**
     * @param {string} defaultStrategy An escaping strategy
     */
    constructor(defaultStrategy: string = 'html') {
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
            new TwingFilterRaw('raw'),
        ];
    }

    /**
     * Sets the default strategy to use when not defined by the user.
     *
     * The strategy can be a valid PHP callback that takes the template
     * name as an argument and returns the strategy to use.
     *
     * @param string|false|callable $defaultStrategy An escaping strategy
     */
    setDefaultStrategy(defaultStrategy: string)
    {
        if (defaultStrategy === 'name') {
            // defaultStrategy = array('Twig_FileExtensionEscapingStrategy', 'guess');
        }

        this.defaultStrategy = defaultStrategy;
    }

    /**
     * Gets the default strategy to use when not defined by the user.
     *
     * @param string $name The template name
     *
     * @return string|false The default strategy to use for the template
     */
    getDefaultStrategy(name: string) {
        // // disable string callables to avoid calling a function named html or js,
        // // or any other upcoming escaping strategy
        // if (!is_string($this->defaultStrategy) && false !== $this->defaultStrategy) {
        //     return call_user_func($this->defaultStrategy, $name);
        // }

        return this.defaultStrategy;
    }
}

export = TwingExtensionEscaper;