const {
    TwingNodeVisitorSafeAnalysis,
    TwingEnvironment,
    TwingLoaderArray,
    TwingNodeExpressionConstant,
    TwingNodeExpressionFunction,
    TwingNode,
    TwingNodeExpressionFilter,
    TwingNodeExpressionMethodCall,
    TwingNodeExpressionGetAttr,
    TwingNodeExpressionName,
    TwingTemplate
} = require("../../../../../../build");

const tap = require('tape');
const sinon = require('sinon');

tap.test('node-visitor/safe-analysis', function (test) {
    test.test('doLeaveNode', function (test) {
        test.test('support not registered filter', function(test) {
            let visitor = new TwingNodeVisitorSafeAnalysis();
            let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let filterNode = new TwingNodeExpressionFilter(new TwingNode(), new TwingNodeExpressionConstant('foo'), new TwingNode(), 1);

            let setSafeStub = sinon.stub(visitor, 'setSafe');

            doLeaveNode(filterNode, env);

            test.true(setSafeStub.calledWith(filterNode, []));

            test.end();
        });

        test.test('support not registered function', function(test) {
            let visitor = new TwingNodeVisitorSafeAnalysis();
            let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let filterNode = new TwingNodeExpressionFunction('foo', new TwingNode(), 1);

            let setSafeStub = sinon.stub(visitor, 'setSafe');

            doLeaveNode(filterNode, env);

            test.true(setSafeStub.calledWith(filterNode, []));

            test.end();
        });

        test.test('support not registered macro', function(test) {
            let visitor = new TwingNodeVisitorSafeAnalysis();
            let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let filterNode = new TwingNodeExpressionMethodCall(new TwingNodeExpressionConstant('foo'), 'foo', null, 1);

            let setSafeStub = sinon.stub(visitor, 'setSafe');

            doLeaveNode(filterNode, env);

            test.true(setSafeStub.calledWith(filterNode, []));

            test.end();
        });

        test.test('support safe "EXPRESSION_GET_ATTR" nodes', function(test) {
            let visitor = new TwingNodeVisitorSafeAnalysis();
            let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let filterNode = new TwingNodeExpressionGetAttr(new TwingNodeExpressionName('foo'), null, null, TwingTemplate.ANY_CALL, 1);

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