const TwingNodeVisitorEscaper = require("../../../../../lib/twing/node-visitor/escaper").TwingNodeVisitorEscaper;
const TwingNodePrint = require("../../../../../lib/twing/node/print").TwingNodePrint;
const TwingEnvironment = require("../../../../../lib/twing/environment").TwingEnvironment;
const TwingLoaderArray = require("../../../../../lib/twing/loader/array").TwingLoaderArray;
const TwingNodeModule = require("../../../../../lib/twing/node/module").TwingNodeModule;
const TwingNodeText = require("../../../../../lib/twing/node/text").TwingNodeText;
const TwingNodeExpressionConstant = require("../../../../../lib/twing/node/expression/constant").TwingNodeExpressionConstant;
const TwingNode = require("../../../../../lib/twing/node").TwingNode;
const TwingSource = require("../../../../../lib/twing/source").TwingSource;
const TwingNodeVisitorSafeAnalysis = require("../../../../../lib/twing/node-visitor/safe-analysis").TwingNodeVisitorSafeAnalysis;

const tap = require('tap');
const sinon = require('sinon');

tap.test('node-visitor/escaper', function (test) {
    test.test('doEnterNode', function (test) {
        test.test('with "module" node', function(test) {
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let visitor = new TwingNodeVisitorEscaper();
            let body = new TwingNodeText('foo', 1);
            let parent = new TwingNodeExpressionConstant('layout.twig', 1);
            let blocks = new TwingNode();
            let macros = new TwingNode();
            let traits = new TwingNode();
            let source = new TwingSource('{{ foo }}', 'foo.twig');
            let module = new TwingNodeModule(body, parent, blocks, macros, traits, [], source);

            sinon.stub(env, 'hasExtension').returns(false);

            test.equals(visitor.doEnterNode(module, env), module, 'returns the node untouched');

            test.end();
        });

        test.end();
    });

    test.test('doLeaveNode', function (test) {
        test.test('with safe "print" node', function(test) {
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let visitor = new TwingNodeVisitorEscaper();
            let safeAnalysis = new TwingNodeVisitorSafeAnalysis();
            let print = new TwingNodePrint(new TwingNodeExpressionConstant('foo', 1), 1);

            sinon.stub(env, 'hasExtension').returns(false);
            sinon.stub(visitor, 'needEscaping').returns('html');
            sinon.stub(safeAnalysis, 'getSafe').returns('html');

            Reflect.set(visitor, 'safeAnalysis', safeAnalysis);

            test.equals(visitor.doLeaveNode(print, env), print, 'returns the node untouched');

            test.end();
        });

        test.end();
    });

    test.end();
});