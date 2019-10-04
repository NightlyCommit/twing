import * as tape from 'tape';
import {TwingNodeVisitorSafeAnalysis} from "../../../../../../src/lib/node-visitor/safe-analysis";
import {TwingEnvironmentNode} from "../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../src/lib/loader/array";
import {TwingNodeExpressionFilter} from "../../../../../../src/lib/node/expression/filter";
import {TwingNode} from "../../../../../../src/lib/node";
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionFunction} from "../../../../../../src/lib/node/expression/function";
import {TwingNodeExpressionMethodCall} from "../../../../../../src/lib/node/expression/method-call";
import {TwingNodeExpressionGetAttr} from "../../../../../../src/lib/node/expression/get-attr";
import {TwingNodeExpressionName} from "../../../../../../src/lib/node/expression/name";
import {TwingTemplate} from "../../../../../../src/lib/template";

const sinon = require('sinon');

tape('node-visitor/safe-analysis', (test) => {
    test.test('doLeaveNode', (test) => {
        test.test('support not registered filter', function(test) {
            let visitor = new TwingNodeVisitorSafeAnalysis();
            let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);
            let env = new TwingEnvironmentNode(new TwingLoaderArray({}));
            let filterNode = new TwingNodeExpressionFilter(new TwingNode(), new TwingNodeExpressionConstant('foo', 1, 1), new TwingNode(), 1, 1);

            let setSafeStub = sinon.stub(visitor, 'setSafe');

            doLeaveNode(filterNode, env);

            test.true(setSafeStub.calledWith(filterNode, []));

            test.end();
        });

        test.test('support not registered function', function(test) {
            let visitor = new TwingNodeVisitorSafeAnalysis();
            let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);
            let env = new TwingEnvironmentNode(new TwingLoaderArray({}));
            let filterNode = new TwingNodeExpressionFunction('foo', new TwingNode(), 1, 1);

            let setSafeStub = sinon.stub(visitor, 'setSafe');

            doLeaveNode(filterNode, env);

            test.true(setSafeStub.calledWith(filterNode, []));

            test.end();
        });

        test.test('support not registered macro', function(test) {
            let visitor = new TwingNodeVisitorSafeAnalysis();
            let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);
            let env = new TwingEnvironmentNode(new TwingLoaderArray({}));
            let filterNode = new TwingNodeExpressionMethodCall(new TwingNodeExpressionConstant('foo', 1, 1), 'foo', null, 1, 1);

            let setSafeStub = sinon.stub(visitor, 'setSafe');

            doLeaveNode(filterNode, env);

            test.true(setSafeStub.calledWith(filterNode, []));

            test.end();
        });

        test.test('support safe "EXPRESSION_GET_ATTR" nodes', function(test) {
            let visitor = new TwingNodeVisitorSafeAnalysis();
            let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);
            let env = new TwingEnvironmentNode(new TwingLoaderArray({}));
            let filterNode = new TwingNodeExpressionGetAttr(new TwingNodeExpressionName('foo', 1, 1), null, null, TwingTemplate.ANY_CALL, 1, 1);

            let setSafeStub = sinon.stub(visitor, 'setSafe');

            visitor.setSafeVars(['foo']);

            doLeaveNode(filterNode, env);

            test.true(setSafeStub.calledWith(filterNode, ['all']));

            test.end();
        });

        test.end();
    });

    test.end();
});