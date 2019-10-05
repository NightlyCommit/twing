import * as tape from 'tape';
import {TwingNodeVisitorOptimizer} from "../../../../../../src/lib/node-visitor/optimizer";
import {TwingEnvironmentNode} from "../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../src/lib/loader/array";
import {TwingNodeFor} from "../../../../../../src/lib/node/for";
import {TwingNodeExpressionAssignName} from "../../../../../../src/lib/node/expression/assign-name";
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNodeInclude} from "../../../../../../src/lib/node/include";
import {TwingNodeExpressionFunction} from "../../../../../../src/lib/node/expression/function";
import {TwingNode} from "../../../../../../src/lib/node";

const sinon = require('sinon');

tape('node-visitor/optimizer', (test) => {
    test.test('constructor', function(test) {
        let visitor = new TwingNodeVisitorOptimizer();

        test.equals(Reflect.get(visitor, 'optimizers'), -1);

        try {
            new TwingNodeVisitorOptimizer('foo' as any);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Optimizer mode "foo" is not valid.');
        }

        try {
            new TwingNodeVisitorOptimizer(15);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Optimizer mode "15" is not valid.');
        }

        test.end();
    });

    test.test('enterOptimizeFor', (test) => {
        test.test('add the loop back', function(test) {
            let visitor = new TwingNodeVisitorOptimizer();
            let enterOptimizeFor = Reflect.get(visitor, 'enterOptimizeFor').bind(visitor);
            let env = new TwingEnvironmentNode(new TwingLoaderArray({}));
            let forNode = new TwingNodeFor(new TwingNodeExpressionAssignName('foo', 1, 1), new TwingNodeExpressionAssignName('foo', 1, 1), new TwingNodeExpressionConstant('foo', 1, 1), null, null, null, 1, 1);

            enterOptimizeFor(forNode, env);

            test.test('when visiting an "include" node', function(test) {
                let includeNode = new TwingNodeInclude(new TwingNodeExpressionConstant('foo', 1, 1), null, false, false, 1, 1);

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
            let env = new TwingEnvironmentNode(new TwingLoaderArray({}));
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