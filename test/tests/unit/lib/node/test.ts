import * as tape from 'tape';
import {TwingNode} from "../../../../../src/lib/node";

tape('token', (test) => {
    test.test('should provide textual representation', (test) => {
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

    test.test('clone', (test) => {
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

    test.test('getAttribute', (test) => {
        let node = new TwingNode();

        try {
            node.getAttribute('foo');

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Attribute "foo" does not exist for Node "TwingNode".');
        }

        test.end();
    });

    test.test('removeAttribute', (test) => {
        let node = new TwingNode(new Map(), new Map([['foo', new TwingNode()]]));

        node.removeAttribute('foo');

        test.false(node.hasAttribute('foo'));

        test.end();
    });

    test.test('getNode', (test) => {
        let node = new TwingNode();

        try {
            node.getNode(0);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Node "0" does not exist for Node "TwingNode".');
        }

        test.end();
    });

    test.test('toString', (test) => {
        let node = new TwingNode(new Map(), new Map([['foo', 'bar']]));

        test.same(node.toString(), 'TwingNode(foo: \'bar\', line: 0, column: 0)');

        test.end();
    });

    test.end();
});
