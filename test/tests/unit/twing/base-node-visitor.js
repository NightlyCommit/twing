const TwingBaseNodeVisitor = require('../../../../lib/twing/base-node-visitor').TwingBaseNodeVisitor;

const tap = require('tap');

tap.test('base-node-visitor', function (test) {
    test.test('constructor', function (test) {
        let visitor = new TwingBaseNodeVisitor();

        test.same(visitor.TwingNodeVisitorInterfaceImpl, visitor);

        test.end();
    });

    test.end();
});