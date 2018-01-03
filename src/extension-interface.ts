/**
 * Interface implemented by extension classes.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import TwingTokenParserInterface from "./token-parser-interface";
import TwingNodeVisitorInterface from "./node-visitor-interface";
import TwingFilter from "./filter";
import TwingTest from "./test";
import TwingFunction from "./function";
import TwingMap from "./map";
import TwingOperatorDefinitionInterface = require("./operator-definition-interface");

interface TwingExtensionInterface {
    /**
     * Returns the token parser instances to add to the existing list.
     *
     * @return Array<TwingTokenParserInterface>
     */
    getTokenParsers(): Array<TwingTokenParserInterface>;

    /**
     * Returns the node visitor instances to add to the existing list.
     *
     * @return Array<TwingNodeVisitorInterface>
     */
    getNodeVisitors(): Array<TwingNodeVisitorInterface>;

    /**
     * Returns a list of filters to add to the existing list.
     *
     * @return Array<TwingFilter>
     */
    getFilters(): Array<TwingFilter>;

    /**
     * Returns a list of tests to add to the existing list.
     *
     * @return Map<string, TwingTest>
     */
    getTests(): Map<string, TwingTest>;

    /**
     * Returns a list of functions to add to the existing list.
     *
     * @return Array<TwingFunction>
     */
    getFunctions(): Array<TwingFunction>;

    /**
     * Returns a list of operators to add to the existing list.
     *
     * @return array<Map<string, TwingOperatorDefinitionInterface>> First array of unary operators, second array of binary operators
     */
    getOperators(): {unary: Map<string, TwingOperatorDefinitionInterface>, binary: Map<string, TwingOperatorDefinitionInterface>};

    /**
     * Gets the default strategy to use when not defined by the user.
     *
     * @param {string} name The template name
     *
     * @return string|false The default strategy to use for the template
     */
    getDefaultStrategy(name: string): string|false;
}

export default TwingExtensionInterface;