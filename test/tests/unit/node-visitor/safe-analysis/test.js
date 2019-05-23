const {TwingNodeVisitorSafeAnalysis} = require('../../../../../build/node-visitor/safe-analysis');
const {TwingEnvironmentNode: TwingEnvironment} = require('../../../../../build/environment/node');
const {TwingLoaderArray} = require('../../../../../build/loader/array');
const {TwingNodeExpressionConstant} = require('../../../../../build/node/expression/constant');
const {TwingNodeExpressionFilter} = require('../../../../../build/node/expression/filter');
const {TwingNodeExpressionMethodCall} = require('../../../../../build/node/expression/method-call');
const {TwingNodeExpressionGetAttr} = require('../../../../../build/node/expression/get-attr');
const {TwingNodeExpressionName} = require('../../../../../build/node/expression/name');
const {TwingNodeExpressionFunction} = require('../../../../../build/node/expression/function');
const {TwingTemplate} = require('../../../../../build/template');
const {TwingNode} = require('../../../../../build/node');

const tap = require('tape');
const sinon = require('sinon');

tap.test('node-visitor/safe-analysis', function (test) {
    test.test('doLeaveNode', function (test) {
        test.test('support not registered filter', function (test) {
            let visitor = new TwingNodeVisitorSafeAnalysis();
            let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let filterNode = new TwingNodeExpressionFilter(new TwingNode(), new TwingNodeExpressionConstant('foo', 1, 1), new TwingNode(), 1, 1);

            let setSafeStub = sinon.stub(visitor, 'setSafe');

            doLeaveNode(filterNode, env);

            test.true(setSafeStub.calledWith(filterNode, []));

            test.end();
        });

        test.test('support not registered function', function (test) {
            let visitor = new TwingNodeVisitorSafeAnalysis();
            let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let filterNode = new TwingNodeExpressionFunction('foo', new TwingNode(), 1, 1);

            let setSafeStub = sinon.stub(visitor, 'setSafe');

            doLeaveNode(filterNode, env);

            test.true(setSafeStub.calledWith(filterNode, []));

            test.end();
        });

        test.test('support not registered macro', function (test) {
            let visitor = new TwingNodeVisitorSafeAnalysis();
            let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let filterNode = new TwingNodeExpressionMethodCall(new TwingNodeExpressionConstant('foo', 1, 1), 'foo', null, 1, 1);

            let setSafeStub = sinon.stub(visitor, 'setSafe');

            doLeaveNode(filterNode, env);

            test.true(setSafeStub.calledWith(filterNode, []));

            test.end();
        });

        test.test('support safe "EXPRESSION_GET_ATTR" nodes', function (test) {
            let visitor = new TwingNodeVisitorSafeAnalysis();
            let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);
            let env = new TwingEnvironment(new TwingLoaderArray({}));
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