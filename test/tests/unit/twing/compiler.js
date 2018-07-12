const TwingNode = require('../../../../lib/twing/node').TwingNode;

const TwingCompiler = require('../../../../lib/twing/compiler').TwingCompiler;
const MockEnvironement = require('../../../mock/environment');
const MockLoader = require('../../../mock/loader');
const TwingNodeExpressionConstant = require('../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;

const tap = require('tap');

tap.test('compiler', function (test) {
    test.test('subcompile method', function (test) {
        let node = new TwingNode(new Map([
            [0, new TwingNodeExpressionConstant(1, 1)]
        ]), new Map(), 1, 'foo');
        let compiler = new TwingCompiler(new MockEnvironement(new MockLoader));

        test.same(compiler.compile(node).indent().subcompile(node).getSource(), '11', 'doesn\'t add indentation when raw is not set');
        test.same(compiler.compile(node).indent().subcompile(node, true).getSource(), '11', 'doesn\'t add indentation when raw is set to true');
        test.same(compiler.compile(node).indent().subcompile(node, false).getSource(), '1    1', 'add indentation when raw is set to false');

        test.end();
    });

    test.test('string method', function (test) {
        let node = new TwingNode(new Map(), new Map(), 1, 'foo');

        let compiler = new TwingCompiler(new MockEnvironement(new MockLoader));

        test.same(compiler.compile(node).string('').getSource(), '\`\`', 'supports empty parameter');
        test.same(compiler.compile(node).string(null).getSource(), '\`\`', 'supports null parameter');
        test.same(compiler.compile(node).string(undefined).getSource(), '\`\`', 'supports undefined parameter');

        test.end();
    });

    test.test('repr method', function (test) {
        let node = new TwingNode(new Map(), new Map(), 1, 'foo');

        let compiler = new TwingCompiler(new MockEnvironement(new MockLoader));

        test.same(compiler.compile(node).repr([1, 2, '3']).getSource(), '[1, 2, \`3\`]', 'supports arrays');
        test.same(compiler.compile(node).repr({1: 'a', 'b': 2, 'c': '3'}).getSource(), '{"1": \`a\`, "b": 2, "c": \`3\`}', 'supports hashes');
        test.same(compiler.compile(node).repr(undefined).getSource(), '', 'supports undefined');

        test.end();
    });

    test.test('outdent method', function(test) {
        let node = new TwingNode(new Map(), new Map(), 1, 'foo');

        let compiler = new TwingCompiler(new MockEnvironement(new MockLoader));

        test.throws(function(){
            compiler.compile(node).outdent();
        }, new Error('Unable to call outdent() as the indentation would become negative.'), 'throws an error if the indentation becomes negative');

        test.end();
    });

    test.end();
});