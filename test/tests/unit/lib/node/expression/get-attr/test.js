const {
    TwingNodeExpressionName,
    TwingNodeExpressionConstant,
    TwingNodeExpressionArray,
    TwingTemplate,
    TwingNodeExpressionGetAttr
} = require('../../../../../../../build/index');

const TwingTestMockCompiler = require('../../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/expression/get-attr', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionName('foo', 1, 1);
        let attr = new TwingNodeExpressionConstant('bar', 1, 1);
        let args = new TwingNodeExpressionArray(new Map(), 1, 1);
        args.addElement(new TwingNodeExpressionName('foo', 1, 1));
        args.addElement(new TwingNodeExpressionConstant('bar', 1, 1));
        let node = new TwingNodeExpressionGetAttr(expr, attr, args, TwingTemplate.ARRAY_CALL, 1, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.getNode('attribute'), attr);
        test.same(node.getNode('arguments'), args);
        test.same(node.getAttribute('type'), TwingTemplate.ARRAY_CALL);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(),1);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        let expr = new TwingNodeExpressionName('foo', 1, 1);
        let attr = new TwingNodeExpressionConstant('bar', 1, 1);
        let args = new TwingNodeExpressionArray(new Map(), 1, 1);
        let node = new TwingNodeExpressionGetAttr(expr, attr, args, TwingTemplate.ANY_CALL, 1, 1);

        test.same(compiler.compile(node).getSource(), `this.traceableMethod(this.getAttribute, 1, this.source)(this.env, (context.has(\`foo\`) ? context.get(\`foo\`) : null), \`bar\`, [])`);

        node = new TwingNodeExpressionGetAttr(expr, attr, args, TwingTemplate.ARRAY_CALL, 1, 1);

        test.same(compiler.compile(node).getSource(), `(() => {let __internal_480b6d2e4b70b4ccce4936e035b2ead64f8213fee7b9a90a92d1f2d0fee68eaa = (context.has(\`foo\`) ? context.get(\`foo\`) : null); return this.isMap(__internal_480b6d2e4b70b4ccce4936e035b2ead64f8213fee7b9a90a92d1f2d0fee68eaa) ? (__internal_480b6d2e4b70b4ccce4936e035b2ead64f8213fee7b9a90a92d1f2d0fee68eaa.has(\`bar\`) ? __internal_480b6d2e4b70b4ccce4936e035b2ead64f8213fee7b9a90a92d1f2d0fee68eaa.get(\`bar\`) : null) : (Array.isArray(__internal_480b6d2e4b70b4ccce4936e035b2ead64f8213fee7b9a90a92d1f2d0fee68eaa) || this.isPlainObject(__internal_480b6d2e4b70b4ccce4936e035b2ead64f8213fee7b9a90a92d1f2d0fee68eaa) ? __internal_480b6d2e4b70b4ccce4936e035b2ead64f8213fee7b9a90a92d1f2d0fee68eaa[\`bar\`] : null);})()`);

        args = new TwingNodeExpressionArray(new Map(), 1, 1);
        args.addElement(new TwingNodeExpressionName('foo', 1, 1));
        args.addElement(new TwingNodeExpressionConstant('bar', 1, 1));
        node = new TwingNodeExpressionGetAttr(expr, attr, args, TwingTemplate.METHOD_CALL, 1, 1);

        test.same(compiler.compile(node).getSource(), `this.traceableMethod(this.getAttribute, 1, this.source)(this.env, (context.has(\`foo\`) ? context.get(\`foo\`) : null), \`bar\`, [(context.has(\`foo\`) ? context.get(\`foo\`) : null), \`bar\`], \`method\`)`);

        test.end();
    });

    test.end();
});
