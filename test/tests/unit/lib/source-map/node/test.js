const {
    TwingSourceMapNode,
    TwingNodeType
} = require("../../../../../../build/index");

const tap = require('tape');

tap.test('source-map/node', (test) => {
    test.test('constructor', (test) => {
        let node = new TwingSourceMapNode('foo', 'bar', 10, 100);

        test.equals(node.getName(), 'foo');
        test.equals(node.getSource(), 'bar');
        test.same(node.getOriginalPosition(), {
            line: 10,
            column: 100
        });
        test.equals(node.getContent(), null);
        test.equals(node.getParent(), null);
        test.same(node.getChildren(), []);
        test.same(node.getCursor(), {
            line: 0,
            column: 0
        });

        test.end();
    });

    test.test('addChild', (test) => {
        let node = new TwingSourceMapNode('node', 'foo', 0, 0);
        let child = new TwingSourceMapNode('child', 'bar', 1, 1);

        node.addChild(child);

        test.equals(child.getParent(), node);
        test.equals(node.getChildren().pop(), child);

        test.end();
    });

    test.test('setContent', (test) => {
        test.test('with false', (test) => {
            let node = new TwingSourceMapNode('node', 'foo', 0, 0);
            let child = new TwingSourceMapNode('child', 'bar', 1, 1);

            node.addChild(child);

            child.setContent(false);

            test.equals(child.getContent(), null);

            test.end();
        });

        test.test('with string', (test) => {
            let node = new TwingSourceMapNode('node', 'foo', 0, 0);
            let child = new TwingSourceMapNode('child', 'bar', 1, 1);

            node.addChild(child);

            child.setContent('\nFoo\nBar');

            test.equals(child.getContent(), '\nFoo\nBar');

            test.end();
        });

        test.end();
    });

    test.test('toMappings', (test) => {
        // index
        let node_0 = new TwingSourceMapNode(TwingNodeType.MODULE, 'index', 0, 0);
        node_0.setContent('Foo Bar \nOof \nBaaaaar ');

        let node_0_0 = new TwingSourceMapNode(TwingNodeType.TEXT, 'index', 1, 0);
        node_0_0.setContent('Foo ');
        node_0.addChild(node_0_0);

        let node_0_1 = new TwingSourceMapNode(TwingNodeType.TEXT, 'index', 2, 0);
        node_0_1.setContent('Bar');
        node_0.addChild(node_0_1);

        let node_0_2 = new TwingSourceMapNode(TwingNodeType.TEXT, 'index', 3, 0);
        node_0_2.setContent(' \nOof');
        node_0.addChild(node_0_2);

        let node_0_3 = new TwingSourceMapNode(TwingNodeType.INCLUDE, 'index', 4, 0);
        node_0_3.setContent(' \nBaaaaar ');
        node_0.addChild(node_0_3);

        // partial
        let node_0_3_0 = new TwingSourceMapNode(TwingNodeType.MODULE, 'partial', 0, 0);
        node_0_3_0.setContent(' \nBaaaaar ');
        node_0_3.addChild(node_0_3_0);

        let node_0_3_0_0 = new TwingSourceMapNode(TwingNodeType.TEXT, 'partial', 1, 0);
        node_0_3_0_0.setContent(' \nBaaaaa');
        node_0_3_0.addChild(node_0_3_0_0);

        let node_0_3_0_1 = new TwingSourceMapNode(TwingNodeType.TEXT, 'partial', 2, 0);
        node_0_3_0_1.setContent('r ');
        node_0_3_0.addChild(node_0_3_0_1);

        let mappings = node_0.toMappings();
        
        test.same(mappings, [
            {
                name: 'module', // "Foo Bar \nOof \nBaaaaar "
                source: 'index',
                original: {line: 1, column: 0},
                generated: {line: 1, column: 0}
            },
            {
                name: 'text', // "Foo "
                source: 'index',
                original: {line: 2, column: 0},
                generated: {line: 1, column: 0}
            },
            {
                name: 'text', // Bar
                source: 'index',
                original: {line: 3, column: 0},
                generated: {line: 1, column: 4}
            },
            {
                name: 'text', // " \nOof"
                source: 'index',
                original: {line: 4, column: 0},
                generated: {line: 1, column: 7}
            },
            {
                name: 'include', // " \nBaaaaar "
                source: 'index',
                original: {line: 5, column: 0},
                generated: {line: 2, column: 3}
            },
            {
                name: 'module', // " \nBaaaaar "
                source: 'partial',
                original: {line: 1, column: 0},
                generated: {line: 2, column: 3}
            },
            {
                name: 'text', // " \nBaaaaa"
                source: 'partial',
                original: {line: 2, column: 0},
                generated: {line: 2, column: 3}
            },
            {
                name: 'text', // "r "
                source: 'partial',
                original: {line: 3, column: 0},
                generated: {line: 3, column: 6}
            }]
        );

        test.end();
    });

    test.end();
});