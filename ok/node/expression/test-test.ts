import * as tape from 'tape';
import TestNodeTestCase from "./../test-case";
import TwingNodeExpressionNullCoalesce from "../../../src/node/expression/null-coalesce";
import TwingNodeExpressionName from "../../../src/node/expression/name";
import TwingNodeExpressionConstant from "../../../src/node/expression/constant";
import TwingNodeExpressionParent from "../../../src/node/expression/parent";
import TwingNodeExpressionTest from "../../../src/node/expression/test";
import TwingNode from "../../../src/node";
import TwingEnvironment from "../../../src/environment";
import TwingLoaderFilesystem from "../../../src/loader/filesystem";
import TwingTest from "../../../src/test";
import TwingNodeExpressionTestNull from "../../../src/node/expression/test/null";
import TwingMap from "../../../src/map";
import TwingLoaderArray from "../../../src/loader/array";
import TwingNodeExpressionArray from "../../../src/node/expression/array";

let nodeTestCase = new TestNodeTestCase();

let createTest = function(node: TwingNode, name: string, nodeArguments: TwingMap<string, TwingNode> = new TwingMap()) {
    return new TwingNodeExpressionTest(node, name, new TwingNode(nodeArguments), 1);
};

let getEnvironment = function() {
    let env = new TwingEnvironment(new TwingLoaderArray(new TwingMap()));

    env.addTest(new TwingTest('anonymous', function () {}));

    return env;
}

tape('node/expression/test', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let expr = new TwingNodeExpressionConstant('foo', 1);
        let name = new TwingNodeExpressionConstant('null', 1);
        let args = new TwingNode();
        let node = new TwingNodeExpressionTest(expr, name, args, 1);

        test.equal(expr, node.getNode('node'));
        test.equal(args, node.getNode('arguments'));
        test.equal(name, node.getAttribute('name'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let environment = new TwingEnvironment(new TwingLoaderFilesystem());

        environment.addTest(new TwingTest('barbar', 'twig_tests_test_barbar', {'is_variadic': true, 'need_context': true}));

        // null
        let expr = new TwingNodeExpressionConstant('foo', 1);
        let node = new TwingNodeExpressionTestNull(expr, 'null', new TwingNode(), 1);

        nodeTestCase.assertNodeCompilation(test, node,'(\'foo\' === null)');

        // test as an anonymous function
        node = createTest(new TwingNodeExpressionConstant('foo', 1), 'anonymous', new TwingMap([['foo', new TwingNodeExpressionConstant('foo', 1)]]));
        nodeTestCase.assertNodeCompilation(test, node,'this.env.getTest(\'anonymous\').getCallable()(\'foo\', \'foo\')', getEnvironment());

        // arbitrary named arguments
        let string = new TwingNodeExpressionConstant('abc', 1);
        node = createTest(string, 'barbar');
        nodeTestCase.assertNodeCompilation(test, node,'twig_tests_test_barbar(\'abc\')', environment);

        node = createTest(string, 'barbar', new TwingMap([
            [0, new TwingNodeExpressionArray(new TwingMap([
                [0, new TwingNodeExpressionConstant('foo', 1)],
                [1, new TwingNodeExpressionConstant('bar', 1)],
                [2, new TwingNodeExpressionConstant('bar', 1)],
                [3, new TwingNodeExpressionConstant('foo', 1)]
            ]), 1)]
        ]));
        nodeTestCase.assertNodeCompilation(test, node,'twig_tests_test_barbar(\'abc\', {\'foo\': \'bar\', \'bar\': \'foo\'})', environment);

        test.end();
    });
});