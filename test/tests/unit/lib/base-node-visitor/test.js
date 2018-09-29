const {TwingBaseNodeVisitor} = require('../../../../../dist/lib/base-node-visitor');

const tap = require('tape');

tap.test('base-node-visitor', function (test) {
    test.test('constructor', function (test) {
        let visitor = new TwingBaseNodeVisitor();

        test.same(visitor.TwingNodeVisitorInterfaceImpl, visitor);

        test.end();
    });

    test.end();
});