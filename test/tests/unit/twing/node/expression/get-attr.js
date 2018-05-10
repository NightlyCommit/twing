
const TwingNodeExpressionConstant = require('../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingTestMockCompiler = require('../../../../../mock/compiler');
const TwingNodeExpressionName = require('../../../../../../lib/twing/node/expression/name').TwingNodeExpressionName;
const TwingNodeExpressionArray = require('../../../../../../lib/twing/node/expression/array').TwingNodeExpressionArray;
const TwingNodeExpressionGetAttr = require('../../../../../../lib/twing/node/expression/get-attr').TwingNodeExpressionGetAttr;
const TwingTemplate = require('../../../../../../lib/twing/template').TwingTemplate;

const tap = require('tap');

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

        test.same(compiler.compile(node).getSource(), `Twing.twingGetAttribute(this.env, this.source, // line 1, column 1
(context.has("foo") ? context.get("foo") : null), "bar", [])`);

        node = new TwingNodeExpressionGetAttr(expr, attr, args, TwingTemplate.ARRAY_CALL, 1, 1);

        test.same(compiler.compile(node).getSource(), `(() => {let __internal_db3e1c01682349779479a9f3dcd1cf998f827b204c72ea9c5de4bf8e120c6239 = // line 1, column 1
(context.has("foo") ? context.get("foo") : null); return Twing.isMap(__internal_db3e1c01682349779479a9f3dcd1cf998f827b204c72ea9c5de4bf8e120c6239) ? (__internal_db3e1c01682349779479a9f3dcd1cf998f827b204c72ea9c5de4bf8e120c6239.has("bar") ? __internal_db3e1c01682349779479a9f3dcd1cf998f827b204c72ea9c5de4bf8e120c6239.get("bar") : null) : (Array.isArray(__internal_db3e1c01682349779479a9f3dcd1cf998f827b204c72ea9c5de4bf8e120c6239) || Twing.isPlainObject(__internal_db3e1c01682349779479a9f3dcd1cf998f827b204c72ea9c5de4bf8e120c6239) ? __internal_db3e1c01682349779479a9f3dcd1cf998f827b204c72ea9c5de4bf8e120c6239["bar"] : null);})()`);

        args = new TwingNodeExpressionArray(new Map(), 1, 1);
        args.addElement(new TwingNodeExpressionName('foo', 1, 1));
        args.addElement(new TwingNodeExpressionConstant('bar', 1, 1));
        node = new TwingNodeExpressionGetAttr(expr, attr, args, TwingTemplate.METHOD_CALL, 1, 1);

        test.same(compiler.compile(node).getSource(), `Twing.twingGetAttribute(this.env, this.source, // line 1, column 1
(context.has("foo") ? context.get("foo") : null), "bar", [// line 1, column 1
(context.has("foo") ? context.get("foo") : null), "bar"], "method")`);

        test.end();
    });

    test.end();
});
