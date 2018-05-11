/* istanbul ignore next */

/**
 * Interface implemented by extension classes.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingFilter} from "./filter";
import {TwingFunction} from "./function";
import {TwingTest} from "./test";
import {TwingOperator} from "./extension";
import {TwingSourceMapGeneratorInterface} from "./source-map/generator-interface";

export interface TwingExtensionInterface {
    TwingExtensionInterfaceImpl: TwingExtensionInterface;

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
     * @return Map<string | number, TwingFilter>
     */
    getFilters(): Map<string | number, TwingFilter>;

    /**
     * Returns a list of tests to add to the existing list.
     *
     * @returns Array<TwingTest>
     */
    getTests(): Array<TwingTest>;

    /**
     * Returns a list of functions to add to the existing list.
     *
     * @return Map<string | number, TwingFunction>
     */
    getFunctions(): Map<string | number, TwingFunction>;

    /**
     * Returns a list of operators to add to the existing list.
     *
     * @return [Map<string, TwingOperator>, Map<string, TwingOperator>] First array of unary operators, second array of binary operators
     */
    getOperators(): [Map<string, TwingOperator>, Map<string, TwingOperator>];

    /**
     * Returns a lost of source-map generatirs to add to the existing list.
     *
     * @returns {Array<TwingSourceMapGeneratorInterface>}
     */
    getSourceMapGenerators?(): Array<TwingSourceMapGeneratorInterface>;
}

