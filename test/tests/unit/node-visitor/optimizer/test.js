const {TwingNodeVisitorOptimizer} = require('../../../../../build/node-visitor/optimizer');
const {TwingEnvironmentNode: TwingEnvironment} = require('../../../../../build/environment/node');
const {TwingLoaderArray} = require('../../../../../build/loader/array');
const {TwingNodeExpressionConstant} = require('../../../../../build/node/expression/constant');
const {TwingNodeExpressionAssignName} = require('../../../../../build/node/expression/assign-name');
const {TwingNodeExpressionFunction} = require('../../../../../build/node/expression/function');
const {TwingNodeInclude} = require('../../../../../build/node/include');
const {TwingNodeFor} = require('../../../../../build/node/for');
const {TwingNode} = require('../../../../../build/node');

const tap = require('tape');
const sinon = require('sinon');

tap.test('node-visitor/optimizer', function (test) {
    test.test('constructor', function(test) {
        let visitor = new TwingNodeVisitorOptimizer();

        test.equals(Reflect.get(visitor, 'optimizers'), -1);

        test.throws(function() {
            visitor = new TwingNodeVisitorOptimizer('foo');
        }, new Error('Optimizer mode "foo" is not valid.'));

        test.throws(function() {
            visitor = new TwingNodeVisitorOptimizer(15);
        }, new Error('Optimizer mode "15" is not valid.'));

        test.end();
    });

    test.test('enterOptimizeFor', function (test) {
        test.test('add the loop back', function(test) {
            let visitor = new TwingNodeVisitorOptimizer();
            let enterOptimizeFor = Reflect.get(visitor, 'enterOptimizeFor').bind(visitor);
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let forNode = new TwingNodeFor(new TwingNodeExpressionAssignName('foo', 1, 1), new TwingNodeExpressionAssignName('foo', 1, 1), new TwingNodeExpressionConstant('foo', 1, 1), null, null, null, 1, 1);

            enterOptimizeFor(forNode, env);

            test.test('when visiting an "include" node', function(test) {
                let includeNode = new TwingNodeInclude(new TwingNodeExpressionConstant('foo', 1, 1), new Map(), false, false, 1, 1);

                let addLoopToAllStub = sinon.stub(visitor, 'addLoopToAll');

                enterOptimizeFor(includeNode, env);

                test.true(addLoopToAllStub.calledOnce);

                addLoopToAllStub.restore();

                test.end();
            });

            test.test('when visiting an "include function" node', function(test) {
                test.test('with "with_context" set to true', function(test) {
                    let functionNode = new TwingNodeExpressionFunction('include', new TwingNode(), 1, 1);
                    let addLoopToAllStub = sinon.stub(visitor, 'addLoopToAll');

                    enterOptimizeFor(functionNode, env);

                    test.true(addLoopToAllStub.calledOnce);

                    addLoopToAllStub.restore();

                    test.end();
                });

                test.end();
            });

            test.end();
        });

        test.test('doesn\'t add the loop back', function(test) {
            let visitor = new TwingNodeVisitorOptimizer();
            let enterOptimizeFor = Reflect.get(visitor, 'enterOptimizeFor').bind(visitor);
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let forNode = new TwingNodeFor(new TwingNodeExpressionAssignName('foo', 1, 1), new TwingNodeExpressionAssignName('foo', 1, 1), new TwingNodeExpressionConstant('foo', 1, 1), null, null, null, 1, 1);

            enterOptimizeFor(forNode, env);

            test.test('when visiting an "include function" node', function(test) {
                test.test('with "with_context" set to false', function(test) {
                    let functionNode = new TwingNodeExpressionFunction('include', new TwingNode(new Map([
                        ['with_context', new TwingNodeExpressionConstant(false, 1, 1)]
                    ])), 1, 1);
                    let addLoopToAllStub = sinon.stub(visitor, 'addLoopToAll');

                    enterOptimizeFor(functionNode, env);

                    test.true(addLoopToAllStub.notCalled);

                    addLoopToAllStub.restore();

                    test.end();
                });

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.end();
});