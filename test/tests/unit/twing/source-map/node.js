const {TwingSourceMapNode} = require("../../../../../lib/twing/source-map/node");
const {TwingNodeType} = require("../../../../../lib/twing/node");
const {SourceMapGenerator, SourceMapConsumer} = require('source-map');

const tap = require('tap');
const merge = require('merge');
const path = require('path');
const fs = require('fs-extra');

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
        test.test('dddd', (test) => {
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

            console.warn(mappings);

            test.same(mappings, [
                {
                    name: 'module', // "Foo Bar \nOof \nBaaaaar "
                    source: 'index',
                    original: {line: 1, column: 0},
                    generated: {line: 1, column: 0}
                },
                {
                    name: 'module', // "Foo Bar \nOof \nBaaaaar "
                    source: 'index',
                    original: {line: 1, column: 0},
                    generated: {line: 2, column: 0}
                },
                {
                    name: 'module', // "Foo Bar \nOof \nBaaaaar "
                    source: 'index',
                    original: {line: 1, column: 0},
                    generated: {line: 3, column: 0}
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
                    name: 'text', // " \nOof"
                    source: 'index',
                    original: {line: 4, column: 0},
                    generated: {line: 2, column: 0}
                },
                {
                    name: 'include', // " \nBaaaaar "
                    source: 'index',
                    original: {line: 5, column: 0},
                    generated: {line: 2, column: 3}
                },
                {
                    name: 'include', // " \nBaaaaar "
                    source: 'index',
                    original: {line: 5, column: 0},
                    generated: {line: 3, column: 0}
                },
                {
                    name: 'module', // " \nBaaaaar "
                    source: 'partial',
                    original: {line: 1, column: 0},
                    generated: {line: 2, column: 3}
                },
                {
                    name: 'module', // " \nBaaaaar "
                    source: 'partial',
                    original: {line: 1, column: 0},
                    generated: {line: 3, column: 0}
                },
                {
                    name: 'text', // " \nBaaaaa"
                    source: 'partial',
                    original: {line: 2, column: 0},
                    generated: {line: 2, column: 3}
                },
                {
                    name: 'text', // " \nBaaaaa"
                    source: 'partial',
                    original: {line: 2, column: 0},
                    generated: {line: 3, column: 0}
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

        test.test('with parent content different from children aggregated content', async (test) => {
            let root = new TwingSourceMapNode('root', 'index', 0, 0);
            root.setContent('Foo BarOofBar');

            let node_0 = new TwingSourceMapNode('node_0', 'index', 1, 0);
            node_0.setContent('Foo Bar');
            root.addChild(node_0);

            let node_0_0 = new TwingSourceMapNode('node_0_0', 'index', 2, 0);
            node_0_0.setContent('Foo');
            node_0.addChild(node_0_0);

            let node_1 = new TwingSourceMapNode('node_1', 'index', 3, 0);
            node_1.setContent('Oof');
            root.addChild(node_1);

            let node_2 = new TwingSourceMapNode('node_2', 'index', 4, 0);
            node_2.setContent('Bar');
            root.addChild(node_2);

            let mappings = root.toMappings();

            console.warn(root.toString());

            console.warn(mappings);

            let expected = [
                {
                    name: 'root',
                    source: 'index',
                    original: {line: 1, column: 0},
                    generated: {line: 1, column: 0}
                },
                {
                    name: 'root',
                    source: 'index',
                    original: {line: 1, column: 0},
                    generated: {line: 1, column: 12}
                },
                {
                    name: 'node_0',
                    source: 'index',
                    original: {line: 2, column: 0},
                    generated: {line: 1, column: 0}
                },
                {
                    name: 'node_0',
                    source: 'index',
                    original: {line: 2, column: 0},
                    generated: {line: 1, column: 6}
                },
                {
                    name: 'node_0_0',
                    source: 'index',
                    original: {line: 3, column: 0},
                    generated: {line: 1, column: 0}
                },
                {
                    name: 'node_0_0',
                    source: 'index',
                    original: {line: 3, column: 0},
                    generated: {line: 1, column: 2}
                },
                {
                    name: 'node_1',
                    source: 'index',
                    original: {line: 4, column: 0},
                    generated: {line: 1, column: 7}
                },
                {
                    name: 'node_1',
                    source: 'index',
                    original: {line: 4, column: 0},
                    generated: {line: 1, column: 9}
                },
                {
                    name: 'node_2',
                    source: 'index',
                    original: {line: 5, column: 0},
                    generated: {line: 1, column: 10}
                },
                {
                    name: 'node_2',
                    source: 'index',
                    original: {line: 5, column: 0},
                    generated: {line: 1, column: 12}
                }
            ];

            test.same(mappings, expected);

            let sourceMapGenerator = new SourceMapGenerator();

            for (let mapping of expected) {
                sourceMapGenerator.addMapping(mapping);
            }

            /** @type SourceMapConsumer */
            let sourceMapConsumer = await SourceMapConsumer.fromSourceMap(sourceMapGenerator);

            test.same(sourceMapConsumer.originalPositionFor({
                line: 1, column: 5, bias: SourceMapConsumer.LEAST_UPPER_BOUND
            }), {
                line: 2, column: 0, name: 'node_0', source: 'index'
            });

            test.end();
        });

        test.end();
    });

    test.end();
});