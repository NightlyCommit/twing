import * as tape from 'tape';
import {TwingOperator, TwingOperatorType} from "../../../../../src/lib/operator";
import {TwingExtension} from "../../../../../src/lib/extension";
import {TwingExtensionSet} from "../../../../../src/lib/extension-set";
import {TwingTokenParserFilter} from "../../../../../src/lib/token-parser/filter";
import {TwingTest} from "../../../../../src/lib/test";
import {TwingFilter} from "../../../../../src/lib/filter";
import {TwingFunction} from "../../../../../src/lib/function";
import {TwingSourceMapNodeFactory} from "../../../../../src/lib/source-map/node-factory";
import {TwingTokenParser} from "../../../../../src/lib/token-parser";
import {Token} from "twig-lexer";
import {TwingNode} from "../../../../../src/lib/node";
import {TwingBaseNodeVisitor} from "../../../../../src/lib/base-node-visitor";
import {TwingEnvironment} from "../../../../../src/lib/environment";
import {spy} from "sinon";

class TwingTestExtensionSetExtension extends TwingExtension {
    getOperators() {
        return [
            new TwingOperator('foo', TwingOperatorType.UNARY, 1, () => null),
            new TwingOperator('bar', TwingOperatorType.BINARY, 1, () => null)
        ];
    }
}

class TwingTestExtensionSetTokenParser extends TwingTokenParser {
    getTag() {
        return 'foo';
    }

    parse(token: Token): TwingNode {
        return null;
    }
}

class TwingTestExtensionSetNodeVisitor extends TwingBaseNodeVisitor {
    protected doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        return undefined;
    }

    protected doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        return undefined;
    }

    getPriority(): number {
        return 0;
    }

}

tape('extension-set', (test) => {
    test.test('addExtension', (test) => {
        let extensionSet = new TwingExtensionSet();

        extensionSet.addExtension(new TwingTestExtensionSetExtension(), 'TwingTestExtensionSetExtension');

        test.true(extensionSet.hasExtension('TwingTestExtensionSetExtension'));

        test.test('initialized', (test) => {
            let extensionSet = new TwingExtensionSet();

            // initialize the extension set
            extensionSet.getFunctions();

            try {
                extensionSet.addExtension(new TwingTestExtensionSetExtension(), 'TwingTestExtensionSetExtension');

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to register extension "TwingTestExtensionSetExtension" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('addTokenParser', (test) => {
        test.test('initialized', (test) => {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            try {
                extensionSet.addTokenParser(new TwingTestExtensionSetTokenParser());

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add token parser "foo" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('addNodeVisitor', (test) => {
        test.test('already registered', (test) => {
            let extensionSet = new TwingExtensionSet();
            let parser = new TwingTokenParserFilter();

            extensionSet.addTokenParser(parser);

            try {
                extensionSet.addTokenParser(new TwingTokenParserFilter());

                test.fail();
            } catch (e) {
                test.same(e.message, 'Tag "filter" is already registered.');
            }

            test.end();
        });

        test.test('initialized', (test) => {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            try {
                extensionSet.addNodeVisitor(new TwingTestExtensionSetNodeVisitor());

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add a node visitor as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('addTest', (test) => {
        test.test('already registered', (test) => {
            let extensionSet = new TwingExtensionSet();

            let test_ = new TwingTest('foo', () => Promise.resolve(true), []);

            extensionSet.addTest(test_);

            try {
                extensionSet.addTest(test_);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Test "foo" is already registered.');
            }

            test.end();
        });

        test.test('initialized', (test) => {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getTests();

            try {
                extensionSet.addTest(new TwingTest('foo', () => Promise.resolve(true), []));

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add test "foo" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('getTests', (test) => {
        let extensionSet = new TwingExtensionSet();
        extensionSet.getTests();

        test.true(extensionSet.isInitialized());

        test.end();
    });

    test.test('addFilter', (test) => {
        test.test('already registered', (test) => {
            let extensionSet = new TwingExtensionSet();

            let filter = new TwingFilter('foo', () => Promise.resolve(), []);

            extensionSet.addFilter(filter);

            try {
                extensionSet.addFilter(filter);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Filter "foo" is already registered.');
            }

            test.end();
        });

        test.test('initialized', (test) => {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFilters();

            try {
                extensionSet.addFilter(new TwingFilter('foo', () => Promise.resolve(), []));

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add filter "foo" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('getFilters', (test) => {
        let extensionSet = new TwingExtensionSet();
        extensionSet.getFilters();

        test.true(extensionSet.isInitialized());

        test.end();
    });

    test.test('addTest', (test) => {
        test.test('initialized', (test) => {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            try {
                extensionSet.addTest(new TwingTest('foo', () => Promise.resolve(true), []));

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add test "foo" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('addFunction', (test) => {
        test.test('already registered', (test) => {
            let extensionSet = new TwingExtensionSet();

            let function_ = new TwingFunction('foo', () => Promise.resolve(), []);

            extensionSet.addFunction(function_);

            try {
                extensionSet.addFunction(function_);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Function "foo" is already registered.');
            }

            test.end();
        });

        test.test('initialized', (test) => {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            try {
                extensionSet.addFunction(new TwingFunction('foo', () => Promise.resolve(), []));

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add function "foo" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('getFunctions', (test) => {
        let extensionSet = new TwingExtensionSet();

        extensionSet.getFunctions();

        test.true(extensionSet.isInitialized());

        test.end();
    });

    test.test('getUnaryOperators', (test) => {
        let extensionSet = new TwingExtensionSet();
        let extension = new TwingTestExtensionSetExtension();

        extensionSet.addExtension(extension, 'TwingTestExtensionSetExtension');

        test.same(extensionSet.getUnaryOperators().size, 1);

        test.end();
    });

    test.test('getBinaryOperators', (test) => {
        let extensionSet = new TwingExtensionSet();
        let extension = new TwingTestExtensionSetExtension();

        extensionSet.addExtension(extension, 'TwingTestExtensionSetExtension');

        test.same(extensionSet.getBinaryOperators().size, 1);

        test.end();
    });

    test.test('addOperator', (test) => {
        test.test('already registered', (test) => {
            let extensionSet = new TwingExtensionSet();

            let operator = new TwingOperator('foo', TwingOperatorType.BINARY, 1, () => null);

            extensionSet.addOperator(operator);

            try {
                extensionSet.addOperator(operator);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Operator "foo" is already registered.');
            }

            test.end();
        });

        test.test('initialized', (test) => {
            let extensionSet = new TwingExtensionSet();
            let extension = new TwingTestExtensionSetExtension();

            extensionSet.addExtension(extension, 'TwingTestExtensionSetExtension');
            // initialize the extension set
            extensionSet.getUnaryOperators();

            try {
                extensionSet.addOperator(new TwingOperator('foo', TwingOperatorType.BINARY, 1, () => null));

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add operator "foo" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('addSourceMapNodeFactory', (test) => {
        test.test('already registered', (test) => {
            let extensionSet = new TwingExtensionSet();

            let factory = new TwingSourceMapNodeFactory('foo' as any);

            extensionSet.addSourceMapNodeFactory(factory);

            try {
                extensionSet.addSourceMapNodeFactory(factory);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Source-map node factory "foo" is already registered.');
            }

            test.end();
        });

        test.test('initialized', (test) => {
            let extensionSet = new TwingExtensionSet();

            // initialize the extension set
            extensionSet.getSourceMapNodeFactories();

            try {
                extensionSet.addSourceMapNodeFactory(new TwingSourceMapNodeFactory('foo' as any));

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add source-map node factory "foo" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('getSourceMapNodeFactories', (test) => {
        let extensionSet = new TwingExtensionSet();

        extensionSet.getSourceMapNodeFactories();

        test.true(extensionSet.isInitialized());

        test.test('on subsequent calls, don\'t initialize extensions', (test) => {
            let fooExtension = new TwingExtension();
            let getFiltersSpy = spy(fooExtension, 'getFilters');

            extensionSet = new TwingExtensionSet();
            extensionSet.addExtension(fooExtension, 'foo');
            extensionSet.getSourceMapNodeFactories();
            extensionSet.getSourceMapNodeFactories();

            test.same(getFiltersSpy.callCount, 1);

            test.end();
        });

        test.end();
    });

    test.test('getSourceMapNodeFactory', (test) => {
        let extensionSet = new TwingExtensionSet();

        let factory = new TwingSourceMapNodeFactory('foo' as any);

        extensionSet.addSourceMapNodeFactory(factory);

        test.same(extensionSet.getSourceMapNodeFactory('foo' as any), factory);

        test.end();
    });

    test.end();
});
