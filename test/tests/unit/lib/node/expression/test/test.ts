import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionTest} from "../../../../../../../src/lib/node/expression/test";
import {TwingNode, TwingNodeType} from "../../../../../../../src/lib/node";
import {MockLoader} from "../../../../../../mock/loader";
import {MockEnvironment} from "../../../../../../mock/environment";
import {TwingTest} from "../../../../../../../src/lib/test";
import {MockCompiler} from "../../../../../../mock/compiler";

function twig_tests_test_barbar(string: string, arg1: any = null, arg2: any = null, args: any[] = []): boolean {
    return true;
}

function createTest(node: TwingNode, name: string, args: Map<any, any> = new Map()) {
    return new TwingNodeExpressionTest(node, name, new TwingNode(args), 1, 1);
}

tape('node/expression/test', (test) => {
    test.test('constructor', (test) => {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let name = new TwingNodeExpressionConstant('null', 1, 1);
        let args = new TwingNode();
        let node = new TwingNodeExpressionTest(expr, name, args, 1, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.getNode('arguments'), args);
        test.same(node.getAttribute('name'), name);
        test.same(node.getType(), TwingNodeType.EXPRESSION_TEST);

        test.end();
    });

    test.test('compile', (test) => {
        let loader = new MockLoader();
        let environment = new MockEnvironment(loader);

        environment.addTest(new TwingTest('barbar', twig_tests_test_barbar, [
            {name: 'arg1', defaultValue: null},
            {name: 'arg2', defaultValue: null}
        ], {
            is_variadic: true,
            needs_context: true
        }));
        environment.addTest(new TwingTest('anonymous', function () {
            return true;
        }, []));

        let compiler = new MockCompiler(environment);

        test.test('test as an anonymous function', (test) => {
            let node = createTest(new TwingNodeExpressionConstant('foo', 1, 1), 'anonymous', new Map([
                [0, new TwingNodeExpressionConstant('foo', 1, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getTest(\'anonymous\').traceableCallable(1, this.source)(...[\`foo\`, \`foo\`])');

            test.end();
        });

        test.test('arbitrary named arguments', (test) => {
            let string = new TwingNodeExpressionConstant('abc', 1, 1);

            let node = createTest(string, 'barbar');

            test.same(compiler.compile(node).getSource(), 'this.env.getTest(\'barbar\').traceableCallable(1, this.source)(...[\`abc\`])');

            node = createTest(string, 'barbar', new Map([
                ['foo', new TwingNodeExpressionConstant('bar', 1, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getTest(\'barbar\').traceableCallable(1, this.source)(...[\`abc\`, null, null, new Map([[\`foo\`, \`bar\`]])])');

            node = createTest(string, 'barbar', new Map<any, TwingNode>([
                [0, new TwingNodeExpressionConstant('1', 1, 1)],
                [1, new TwingNodeExpressionConstant('2', 1, 1)],
                [2, new TwingNodeExpressionConstant('3', 1, 1)],
                ['foo', new TwingNodeExpressionConstant('bar', 1, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getTest(\'barbar\').traceableCallable(1, this.source)(...[\`abc\`, \`1\`, \`2\`, new Map([[0, \`3\`], [\`foo\`, \`bar\`]])])');

            test.end();
        });

        test.end();
    });

    test.end();
});
