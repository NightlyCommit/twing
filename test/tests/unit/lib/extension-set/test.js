const {
    TwingExtensionSet,
    TwingExtension,
    TwingFunction,
    TwingTest,
    TwingFilter,
    TwingOperator,
    TwingOperatorType,
    TwingTokenParserFilter,
    TwingSourceMapNodeFactory
} = require("../../../../../dist/cjs/main");

const tap = require('tape');

class TwingTestExtensionSetExtension extends TwingExtension {
    getOperators() {
        return [
            new TwingOperator('foo', TwingOperatorType.UNARY, 1, () => null),
            new TwingOperator('bar', TwingOperatorType.BINARY, 1, () => null)
        ];
    }
}

class TwingTestExtensionSetTokenParser {
    getTag() {
        return 'foo';
    }
}

class TwingTestExtensionSetNodeVisitor {

}

tap.test('extension-set', function (test) {
    test.test('addExtension', function (test) {
        let extensionSet = new TwingExtensionSet();

        extensionSet.addExtension(new TwingTestExtensionSetExtension(), 'TwingTestExtensionSetExtension');

        test.true(extensionSet.hasExtension('TwingTestExtensionSetExtension'));

        test.test('initialized', function (test) {
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

    test.test('addTokenParser', function (test) {
        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            test.throws(function () {
                extensionSet.addTokenParser(new TwingTestExtensionSetTokenParser());
            }, new Error('Unable to add token parser "foo" as extensions have already been initialized.'));

            test.end();
        });

        test.end();
    });

    test.test('addNodeVisitor', function (test) {
        test.test('already registered', function (test) {
            let extensionSet = new TwingExtensionSet();
            let parser = new TwingTokenParserFilter();

            extensionSet.addTokenParser(parser);

            test.throws(function () {
                extensionSet.addTokenParser(new TwingTokenParserFilter());
            }, new Error('Tag "filter" is already registered.'));

            test.end();
        });

        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            test.throws(function () {
                extensionSet.addNodeVisitor(new TwingTestExtensionSetNodeVisitor());
            }, new Error('Unable to add a node visitor as extensions have already been initialized.'));

            test.end();
        });

        test.end();
    });

    test.test('addTest', function (test) {
        test.test('already registered', function (test) {
            let extensionSet = new TwingExtensionSet();

            let test_ = new TwingTest('foo', () => {
            });

            extensionSet.addTest(test_);

            try {
                extensionSet.addTest(test_);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Test "foo" is already registered.');
            }

            test.end();
        });

        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getTests();

            try {
                extensionSet.addTest(new TwingTest('foo', () => {
                }));

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add test "foo" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('getTests', function (test) {
        let extensionSet = new TwingExtensionSet();
        extensionSet.getTests();

        test.true(extensionSet.isInitialized());

        test.end();
    });

    test.test('addFilter', function (test) {
        test.test('already registered', function (test) {
            let extensionSet = new TwingExtensionSet();

            let filter = new TwingFilter('foo', () => {
            });

            extensionSet.addFilter(filter);

            try {
                extensionSet.addFilter(filter);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Filter "foo" is already registered.');
            }

            test.end();
        });

        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFilters();

            try {
                extensionSet.addFilter(new TwingFilter('foo', () => {
                }));

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add filter "foo" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('getFilters', function (test) {
        let extensionSet = new TwingExtensionSet();
        extensionSet.getFilters();

        test.true(extensionSet.isInitialized());

        test.end();
    });

    test.test('getFilter', function (test) {
        test.test('with filter callback returning false', function (test) {
            let extensionSet = new TwingExtensionSet();

            extensionSet.registerUndefinedFilterCallback(() => {
                return false;
            });

            test.same(extensionSet.getFilter('foo'), null);

            test.end();
        });

        test.end();
    });

    test.test('addTest', function (test) {
        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            test.throws(function () {
                extensionSet.addTest(new TwingTest('foo', () => {
                }));
            }, new Error('Unable to add test "foo" as extensions have already been initialized.'));

            test.end();
        });

        test.end();
    });

    test.test('addFunction', function (test) {
        test.test('already registered', function (test) {
            let extensionSet = new TwingExtensionSet();

            let function_ = new TwingFunction('foo', () => {
            });

            extensionSet.addFunction(function_);

            try {
                extensionSet.addFunction(function_);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Function "foo" is already registered.');
            }

            test.end();
        });

        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            try {
                extensionSet.addFunction(new TwingFunction('foo', () => {
                }));

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add function "foo" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('getFunctions', function (test) {
        let extensionSet = new TwingExtensionSet();

        extensionSet.getFunctions();

        test.true(extensionSet.isInitialized());

        test.end();
    });

    test.test('getFunction', function (test) {
        test.test('with function callback returning false', function (test) {
            let extensionSet = new TwingExtensionSet();

            extensionSet.registerUndefinedFunctionCallback(() => {
                return false;
            });

            test.same(extensionSet.getFunction('foo'), null);

            test.end();
        });

        test.end();
    });

    test.test('getUnaryOperators', function (test) {
        let extensionSet = new TwingExtensionSet();
        let extension = new TwingTestExtensionSetExtension();

        extensionSet.addExtension(extension, 'TwingTestExtensionSetExtension');

        test.same(extensionSet.getUnaryOperators().size, 1);

        test.end();
    });

    test.test('getBinaryOperators', function (test) {
        let extensionSet = new TwingExtensionSet();
        let extension = new TwingTestExtensionSetExtension();

        extensionSet.addExtension(extension, 'TwingTestExtensionSetExtension');

        test.same(extensionSet.getBinaryOperators().size, 1);

        test.end();
    });

    test.test('addOperator', function (test) {
        test.test('already registered', function (test) {
            let extensionSet = new TwingExtensionSet();

            let operator = new TwingOperator('foo', TwingOperatorType.BINARY, 1, () => {
            });

            extensionSet.addOperator(operator);

            try {
                extensionSet.addOperator(operator);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Operator "foo" is already registered.');
            }

            test.end();
        });

        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            let extension = new TwingTestExtensionSetExtension();

            extensionSet.addExtension(extension, 'TwingTestExtensionSetExtension');
            // initialize the extension set
            extensionSet.getUnaryOperators();

            try {
                extensionSet.addOperator(new TwingOperator('foo', TwingOperatorType.BINARY, 1, () => {
                }));

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add operator "foo" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('addSourceMapNodeFactory', function (test) {
        test.test('already registered', function (test) {
            let extensionSet = new TwingExtensionSet();

            let factory = new TwingSourceMapNodeFactory('foo');

            extensionSet.addSourceMapNodeFactory(factory);

            try {
                extensionSet.addSourceMapNodeFactory(factory);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Source-map node factory "foo" is already registered.');
            }

            test.end();
        });

        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();

            // initialize the extension set
            extensionSet.getSourceMapNodeFactories();

            try {
                extensionSet.addSourceMapNodeFactory(new TwingSourceMapNodeFactory('foo'));

                test.fail();
            } catch (e) {
                test.same(e.message, 'Unable to add source-map node factory "foo" as extensions have already been initialized.');
            }

            test.end();
        });

        test.end();
    });

    test.test('getSourceMapNodeFactories', function (test) {
        let extensionSet = new TwingExtensionSet();

        extensionSet.getSourceMapNodeFactories();

        test.true(extensionSet.isInitialized());

        test.end();
    });

    test.test('getSourceMapNodeFactory', function (test) {
        let extensionSet = new TwingExtensionSet();

        let factory = new TwingSourceMapNodeFactory('foo');

        extensionSet.addSourceMapNodeFactory(factory);

        test.same(extensionSet.getSourceMapNodeFactory('foo'), factory);

        test.end();
    });

    test.end();
});