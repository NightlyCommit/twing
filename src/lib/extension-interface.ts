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
import {TwingOperator} from "./operator";
import {TwingSourceMapNodeConstructor} from "./source-map/node";
import {TwingNodeType} from "./node";

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
     * @return Array<TwingFilter>
     */
    getFilters(): TwingFilter[];

    /**
     * Returns a list of tests to add to the existing list.
     *
     * @returns Array<TwingTest>
     */
    getTests(): TwingTest[];

    /**
     * Returns a list of functions to add to the existing list.
     *
     * @return Array<TwingFunction>
     */
    getFunctions(): TwingFunction[];

    /**
     * Returns a list of operators to add to the existing list.
     *
     * @return TwingOperator[]
     */
    getOperators(): TwingOperator[];

    /**
     * Returns a list of constructors keyed by node type that will be used to construct the source-map nodes.
     *
     * @return Map<TwingNodeType, TwingSourceMapNodeConstructor>
     */
    getSourceMapNodeConstructors(): Map<TwingNodeType, TwingSourceMapNodeConstructor>;
}

