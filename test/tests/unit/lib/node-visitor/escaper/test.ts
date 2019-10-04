import * as tape from 'tape';
import {TwingEnvironmentNode} from "../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../src/lib/loader/array";
import {TwingNodeVisitorEscaper} from "../../../../../../src/lib/node-visitor/escaper";
import {TwingNodeText} from "../../../../../../src/lib/node/text";
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNode} from "../../../../../../src/lib/node";
import {TwingSource} from "../../../../../../src/lib/source";
import {TwingNodeModule} from "../../../../../../src/lib/node/module";
import {TwingNodeVisitorSafeAnalysis} from "../../../../../../src/lib/node-visitor/safe-analysis";
import {TwingNodePrint} from "../../../../../../src/lib/node/print";

const sinon = require('sinon');

tape('node-visitor/escaper', (test) => {
    test.test('doEnterNode', (test) => {
        test.test('with "module" node', function(test) {
            let env = new TwingEnvironmentNode(new TwingLoaderArray({}));
            let visitor = new TwingNodeVisitorEscaper();
            let body = new TwingNodeText('foo', 1, 1);
            let parent = new TwingNodeExpressionConstant('layout.twig', 1, 1);
            let blocks = new TwingNode();
            let macros = new TwingNode();
            let traits = new TwingNode();
            let source = new TwingSource('{{ foo }}', 'foo.twig');
            let module = new TwingNodeModule(body, parent, blocks, macros, traits, [], source);

            sinon.stub(env, 'hasExtension').returns(false);

            test.equals(visitor.enterNode(module, env), module, 'returns the node untouched');

            test.end();
        });

        test.end();
    });

    test.test('doLeaveNode', (test) => {
        test.test('with safe "print" node', function(test) {
            let env = new TwingEnvironmentNode(new TwingLoaderArray({}));
            let visitor = new TwingNodeVisitorEscaper();
            let safeAnalysis = new TwingNodeVisitorSafeAnalysis();
            let print = new TwingNodePrint(new TwingNodeExpressionConstant('foo', 1, 1), 1, 1);

            sinon.stub(env, 'hasExtension').returns(false);
            sinon.stub(visitor, 'needEscaping').returns('html');
            sinon.stub(safeAnalysis, 'getSafe').returns('html');

            Reflect.set(visitor, 'safeAnalysis', safeAnalysis);

            test.equals(visitor.leaveNode(print, env), print, 'returns the node untouched');

            test.end();
        });

        test.end();
    });

    test.end();
});