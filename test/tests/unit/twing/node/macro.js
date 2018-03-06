const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeExpressionConstant = require('../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingMap = require('../../../../../lib/twing/map').TwingMap;
const TwingNode = require('../../../../../lib/twing/node').TwingNode;
const TwingNodeExpressionName = require('../../../../../lib/twing/node/expression/name').TwingNodeExpressionName;
const TwingNodeText = require('../../../../../lib/twing/node/text').TwingNodeText;
const TwingNodeMacro = require('../../../../../lib/twing/node/macro').TwingNodeMacro;
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

tap.test('node/macro', function (test) {
    test.test('constructor', function (test) {
        let body = new TwingNodeText('foo', 1);

        let argumentsNode = new TwingMap();

        argumentsNode.push(new TwingNodeExpressionName('foo', 1));

        let arguments_ = new TwingNode(argumentsNode, new TwingMap(), 1);
        let node = new TwingNodeMacro('foo', body, arguments_, 1);

        test.same(node.getNode('body'), body);
        test.same(node.getNode('arguments'), arguments_);
        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.MACRO);

        test.end();
    });

    test.test('compile', function (test) {
        let body = new TwingNodeText('foo', 1);

        let arguments_ = new TwingNode(new TwingMap([
            ['foo', new TwingNodeExpressionConstant(null, 1)],
            ['bar', new TwingNodeExpressionConstant('Foo', 1)]
        ]), new TwingMap(), 1);
        let node = new TwingNodeMacro('foo', body, arguments_, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1
async macro_foo(__foo__ = null, __bar__ = "Foo", ...__varargs__) {
    let context = this.env.mergeGlobals(new Twing.TwingMap([
        ["foo", __foo__],
        ["bar", __bar__],
        ["varargs", __varargs__]
    ]));

    let blocks = new Twing.TwingMap();
    let result;
    let error;

    Twing.obStart();
    try {
        Twing.echo("foo");

        let tmp = Twing.obGetContents();
        result = (tmp === '') ? '' : new Twing.TwingMarkup(tmp, this.env.getCharset());
    }
    catch (e) {
        error = e;
    }

    Twing.obEndClean();

    if (error) {
        throw error;
    }
    return result;
}

`);

        test.end();
    });

    test.end();
});
