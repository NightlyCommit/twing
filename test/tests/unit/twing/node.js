const tap = require('tap');
const TwingNode = require('../../../../lib/twing/node').TwingNode;
const TwingMap = require('../../../../lib/twing/map').TwingMap;

tap.test('token', function (test) {
    test.test('should provide textual representation', function(test) {
        let node = new TwingNode(new TwingMap([
            ['foo', new TwingNode(new TwingMap(), new TwingMap(), 2, 'foo')]
        ]), new TwingMap([
            ['foo-attr', new TwingNode(new TwingMap(), new TwingMap(), 2, 'bar')]
        ]), 1, 'foo');

        test.same(node.toString(), `TwingNode(foo-attr: array (  outputType => 'none',  name => null,  nodes =>   array (  ),  attributes =>   array (  ),  lineno => 2,  tag => 'bar',  type => null)
  foo: TwingNode()
)`);

        test.end();
    });

    test.end();
});
