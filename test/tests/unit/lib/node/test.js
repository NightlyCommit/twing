const {TwingNode} = require('../../../../../build/main');

const tap = require('tape');

tap.test('token', function (test) {
    test.test('should provide textual representation', function (test) {
        let node = new TwingNode(new Map([
            ['foo', new TwingNode(new Map(), new Map(), 2, 1, 'foo')]
        ]), new Map([
            ['foo-attr', new TwingNode(new Map(), new Map(), 2, 1, 'bar')]
        ]), 1, 1, 'foo');

        test.same(node.toString(), `TwingNode(foo-attr: TwingNode(line: 2, column: 1), line: 1, column: 1
  foo: TwingNode(line: 2, column: 1)
)`);

        test.end();
    });

    test.test('clone', function (test) {
        let childNode = new TwingNode();
        let childAttribute = new TwingNode();
        let node = new TwingNode(new Map([[0, childNode]]), new Map([['foo', childAttribute]]));
        let clone = node.clone();

        test.notEquals(clone, node);
        test.notEquals(clone.getNode(0), childNode);
        test.notEquals(clone.getAttribute('foo'), childAttribute);
        test.same(clone.getTemplateLine(), node.getTemplateLine());
        test.same(clone.getTemplateColumn(), node.getTemplateColumn());
        test.same(clone.getType(), node.getType());
        test.same(clone.getNodeTag(), node.getNodeTag());

        test.end();
    });

    test.test('getAttribute', function (test) {
        let node = new TwingNode();

        test.throws(function (test) {
            node.getAttribute('foo');
        }, new Error('Attribute "foo" does not exist for Node "TwingNode".'));

        test.end();
    });

    test.test('removeAttribute', function (test) {
        let node = new TwingNode(new Map(), new Map([['foo', new TwingNode()]]));

        node.removeAttribute('foo');

        test.false(node.hasAttribute('foo'));

        test.end();
    });

    test.test('getNode', function (test) {
        let node = new TwingNode();

        test.throws(function (test) {
            node.getNode(0);
        }, new Error('Node "0" does not exist for Node "TwingNode".'));

        test.end();
    });

    test.test('toString', function (test) {
        let node = new TwingNode(new Map(), new Map([['foo', 'bar']]));

        test.same(node.toString(), 'TwingNode(foo: \'bar\', line: 0, column: 0)');

        test.end();
    });

    test.end();
});
