const tap = require('tap');
const TwingNode = require('../../../../lib/twing/node').TwingNode;


tap.test('token', function (test) {
    test.test('should provide textual representation', function(test) {
        let node = new TwingNode(new Map([
            ['foo', new TwingNode(new Map(), new Map(), 2, 'foo')]
        ]), new Map([
            ['foo-attr', new TwingNode(new Map(), new Map(), 2, 'bar')]
        ]), 1, 'foo');

        test.same(node.toString(), `TwingNode(foo-attr: array (  outputType => 'none',  name => null,  nodes =>   array (  ),  attributes =>   array (  ),  lineno => 2,  tag => 'bar',  type => null)
  foo: TwingNode()
)`);

        test.end();
    });

    test.end();
});
