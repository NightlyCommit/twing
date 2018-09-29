const {
    TwingExtensionSet,
    TwingExtension,
    TwingFunction,
    TwingTest,
    TwingFilter
} = require("../../../../../dist/index");

const tap = require('tape');
const sinon = require('sinon');

class TwingTestExtensionSetExtension extends TwingExtension {
    constructor() {
        super();

        this.TwingExtensionGlobalsInterfaceImpl = {
            getGlobals: () => {
                return new Map([
                    ['foo', 'bar']
                ]);
            }
        };
    }

    getOperators() {
        return [
            new Map([
                ['foo', {}]
            ]),
            new Map([
                ['foo', {}]
            ])
        ];
    }
}

class TwingTestExtensionSetExtensionInvalid extends TwingExtension {
    constructor() {
        super();

        this.TwingExtensionGlobalsInterfaceImpl = {
            getGlobals: () => {
                return 'foo';
            }
        };
    }
}

class TwingTestExtensionSetTokenParser {

}

class TwingTestExtensionSetNodeVisitor {

}

tap.test('extension-set', function (test) {
    test.test('addExtension', function (test) {
        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            test.throws(function() {
                extensionSet.addExtension(new TwingTestExtensionSetExtension());
            }, new Error('Unable to register extension "TwingTestExtensionSetExtension" as extensions have already been initialized.'));

            test.end();
        });

        test.end();
    });

    test.test('addTokenParser', function (test) {
        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            test.throws(function() {
                extensionSet.addTokenParser(new TwingTestExtensionSetTokenParser());
            }, new Error('Unable to add a token parser as extensions have already been initialized.'));

            test.end();
        });

        test.end();
    });

    test.test('addNodeVisitor', function (test) {
        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            test.throws(function() {
                extensionSet.addNodeVisitor(new TwingTestExtensionSetNodeVisitor());
            }, new Error('Unable to add a node visitor as extensions have already been initialized.'));

            test.end();
        });

        test.end();
    });

    test.test('addTest', function (test) {
        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            test.throws(function() {
                extensionSet.addTest(new TwingTest('foo', () => {}));
            }, new Error('Unable to add test "foo" as extensions have already been initialized.'));

            test.end();
        });

        test.end();
    });

    test.test('getTests', function(test) {
        let extensionSet = new TwingExtensionSet();
        extensionSet.getTests();

        test.true(extensionSet.isInitialized());

        test.end();
    });

    test.test('addFilter', function (test) {
        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            // initialize the extension set
            extensionSet.getFunctions();

            test.throws(function() {
                extensionSet.addFilter(new TwingFilter('foo', () => {}));
            }, new Error('Unable to add filter "foo" as extensions have already been initialized.'));

            test.end();
        });

        test.end();
    });

    test.test('getFilters', function(test) {
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

    test.test('getGlobals', function (test) {
        test.test('valid extension', function (test) {
            let extensionSet = new TwingExtensionSet();
            let extension = new TwingTestExtensionSetExtension();

            extensionSet.addExtension(extension);

            test.same(extensionSet.getGlobals(), extension.TwingExtensionGlobalsInterfaceImpl.getGlobals());

            test.end();
        });

        test.test('invalid extension', function (test) {
            let extensionSet = new TwingExtensionSet();

            extensionSet.addExtension(new TwingTestExtensionSetExtensionInvalid());

            test.throws(function () {
                extensionSet.getGlobals();
            }, new Error('"TwingTestExtensionSetExtensionInvalid[TwingExtensionGlobalsInterface].getGlobals()" must return a Map of globals.'));

            test.end();
        });

        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            let extension = new TwingTestExtensionSetExtension();

            extensionSet.addExtension(extension);
            // initialize the extension set
            extensionSet.getFunctions();

            sinon.spy(extension.TwingExtensionGlobalsInterfaceImpl, 'getGlobals');

            let globals = extensionSet.getGlobals();

            extensionSet.getGlobals();

            test.same(extension.TwingExtensionGlobalsInterfaceImpl.getGlobals.callCount, 1, 'getGlobals should return extension set globals if set');
            test.same(globals, extension.TwingExtensionGlobalsInterfaceImpl.getGlobals());

            test.end();
        });

        test.end();
    });

    test.test('getUnaryOperators', function (test) {
        let extensionSet = new TwingExtensionSet();
        let extension = new TwingTestExtensionSetExtension();

        extensionSet.addExtension(extension);

        test.same(extensionSet.getUnaryOperators(), extension.getOperators()[0]);

        test.end();
    });

    test.test('getBinaryOperators', function (test) {
        let extensionSet = new TwingExtensionSet();
        let extension = new TwingTestExtensionSetExtension();

        extensionSet.addExtension(extension);

        test.same(extensionSet.getBinaryOperators(), extension.getOperators()[1]);

        test.end();
    });

    test.test('addFunction', function (test) {
        test.test('initialized', function (test) {
            let extensionSet = new TwingExtensionSet();
            let extension = new TwingTestExtensionSetExtension();

            extensionSet.addExtension(extension);
            // initialize the extension set
            extensionSet.getFunctions();

            test.throws(function () {
                extensionSet.addFunction(new TwingFunction('foo', () => {
                }));
            }, new Error('Unable to add function "foo" as extensions have already been initialized.'));

            test.end();
        });

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

    test.end();
});