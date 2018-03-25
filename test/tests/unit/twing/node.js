const tap = require('tap');
const TwingNode = require('../../../../lib/twing/node').TwingNode;


tap.test('token', function (test) {
    test.test('should provide textual representation', function(test) {
        let node = new TwingNode(new Map([
            ['foo', new TwingNode(new Map(), new Map(), 2, 'foo')]
        ]), new Map([
            ['foo-attr', new TwingNode(new Map(), new Map(), 2, 'bar')]
        ]), 1, 'foo');

        test.same(node.toString(), `TwingNode(foo-attr: array (  name => null,  nodes =>   array (  ),  attributes =>   array (  ),  lineno => 2,  tag => 'bar',  type => null)
  foo: TwingNode()
)`);

        test.end();
    });

    test.test('clone', function(test) {
        let childNode = new TwingNode();
        let childAttribute = new TwingNode();
        let node = new TwingNode(new Map([[0, childNode]]), new Map([['foo', childAttribute]]));
        let clone = node.clone();

        test.notEquals(clone, node);
        test.notEquals(clone.getNode(0), childNode);
        test.notEquals(clone.getAttribute('foo'), childAttribute);

        test.end();
    });

    test.test('getAttribute', function(test) {
        let node = new TwingNode();

        test.throws(function(test) {
            node.getAttribute('foo');
        }, new Error('Attribute "foo" does not exist for Node "TwingNode".'));

        test.end();
    });

    test.test('removeAttribute', function(test) {
        let node = new TwingNode(new Map(), new Map([['foo', new TwingNode()]]));

        node.removeAttribute('foo');

        test.false(node.hasAttribute('foo'));

        test.end();
    });

    test.test('getNode', function(test) {
        let node = new TwingNode();

        test.throws(function(test) {
            node.getNode(0);
        }, new Error('Node "0" does not exist for Node "TwingNode".'));

        test.end();
    });

    test.end();
});
