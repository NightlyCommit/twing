const {
    TwingNodeIf,
    TwingNode,
    TwingNodeExpressionConstant,
    TwingNodeType,
    TwingNodePrint,
    TwingNodeExpressionName
} = require('../../../../../../build/main');
const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/if', function (test) {
    test.test('constructor', function (test) {
        let tNodes = new Map([
            [0, new TwingNodeExpressionConstant(true, 1, 1)],
            [1, new TwingNodePrint(new TwingNodeExpressionName('foo', 1, 1), 1, 1)]
        ]);

        let t = new TwingNode(tNodes, new Map(), 1, 1);
        let else_ = null;
        let node = new TwingNodeIf(t, else_, 1, 1);

        test.same(node.getNode('tests'), t);
        test.false(node.hasNode('else'));

        else_ = new TwingNodePrint(new TwingNodeExpressionName('bar', 1, 1), 1, 1);
        node = new TwingNodeIf(t, else_, 1, 1);

        test.same(node.getNode('else'), else_);
        test.same(node.getType(), TwingNodeType.IF);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        test.test('without else', function (test) {
            let tNodes = new Map([
                [0, new TwingNodeExpressionConstant(true, 1, 1)],
                [1, new TwingNodePrint(new TwingNodeExpressionName('foo', 1, 1), 1, 1)]
            ]);

            let t = new TwingNode(tNodes, new Map(), 1, 1);
            let else_ = null;
            let node = new TwingNodeIf(t, else_, 1, 1);

            test.same(compiler.compile(node).getSource(), `if (true) {
    this.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
}
`);
            test.end();
        });

        test.test('with multiple tests', function (test) {
            let tNodes = new Map([
                [0, new TwingNodeExpressionConstant(true, 1, 1)],
                [1, new TwingNodePrint(new TwingNodeExpressionName('foo', 1, 1), 1, 1)],
                [2, new TwingNodeExpressionConstant(false, 1, 1)],
                [3, new TwingNodePrint(new TwingNodeExpressionName('bar', 1, 1), 1, 1)]
            ]);

            let t = new TwingNode(tNodes, new Map(), 1, 1);
            let else_ = null;

            let node = new TwingNodeIf(t, else_, 1, 1);

            test.same(compiler.compile(node).getSource(), `if (true) {
    this.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
}
else if (false) {
    this.echo((context.has(\`bar\`) ? context.get(\`bar\`) : null));
}
`);
            test.end();
        });

        test.test('with else', function (test) {
            let tNodes = new Map([
                [0, new TwingNodeExpressionConstant(true, 1, 1)],
                [1, new TwingNodePrint(new TwingNodeExpressionName('foo', 1, 1), 1, 1)]
            ]);

            let t = new TwingNode(tNodes, new Map(), 1, 1);
            let else_ = new TwingNodePrint(new TwingNodeExpressionName('bar', 1, 1), 1, 1);

            let node = new TwingNodeIf(t, else_, 1, 1);

            test.same(compiler.compile(node).getSource(), `if (true) {
    this.echo((context.has(\`foo\`) ? context.get(\`foo\`) : null));
}
else {
    this.echo((context.has(\`bar\`) ? context.get(\`bar\`) : null));
}
`);
            test.end();
        });

        test.test('with multiple elseif', function (test) {
            let tNodes = new Map([
                [0, new TwingNodeExpressionName('a', 1)],
                [1, new TwingNodePrint(new TwingNodeExpressionConstant('a', 1), 1)],
                [2, new TwingNodeExpressionName('b', 1)],
                [3, new TwingNodePrint(new TwingNodeExpressionConstant('b', 1), 1)],
                [4, new TwingNodeExpressionName('c', 1)],
                [5, new TwingNodePrint(new TwingNodeExpressionConstant('c', 1), 1)],
            ]);

            let t = new TwingNode(tNodes, new Map(), 1);
            let else_ = new TwingNodePrint(new TwingNodeExpressionName('bar', 1), 1);

            let node = new TwingNodeIf(t, else_, 1);

            test.same(compiler.compile(node).getSource(), `if ((context.has(\`a\`) ? context.get(\`a\`) : null)) {
    this.echo(\`a\`);
}
else if ((context.has(\`b\`) ? context.get(\`b\`) : null)) {
    this.echo(\`b\`);
}
else if ((context.has(\`c\`) ? context.get(\`c\`) : null)) {
    this.echo(\`c\`);
}
else {
    this.echo((context.has(\`bar\`) ? context.get(\`bar\`) : null));
}
`);
            test.end();
        });

        test.end();
    });

    test.end();
});
