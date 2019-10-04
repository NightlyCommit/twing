import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNodeInclude} from "../../../../../../src/lib/node/include";
import {TwingNodeExpressionArray} from "../../../../../../src/lib/node/expression/array";
import {TwingNodeType} from "../../../../../../src/lib/node";
import {MockCompiler} from "../../../../../mock/compiler";
import {TwingNodeExpressionConditional} from "../../../../../../src/lib/node/expression/conditional";
import {TwingNodeExpressionHash} from "../../../../../../src/lib/node/expression/hash";

tape('node/include', (test) => {
    test.test('constructor', (test) => {
        let expr = new TwingNodeExpressionConstant('foo.twig', 1, 1);
        let node = new TwingNodeInclude(expr, null, false, false, 1, 1);

        test.false(node.hasNode('variables'));
        test.same(node.getNode('expr'), expr);
        test.false(node.getAttribute('only'));

        let arrayNodes = new Map([
            [0, new TwingNodeExpressionConstant('foo', 1, 1)],
            [1, new TwingNodeExpressionConstant(true, 1, 1)]
        ]);

        let vars = new TwingNodeExpressionArray(arrayNodes, 1, 1);
        node = new TwingNodeInclude(expr, vars, true, false, 1, 1);

        test.same(node.getNode('variables'), vars);
        test.true(node.getAttribute('only'));
        test.same(node.getType(), TwingNodeType.INCLUDE);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', (test) => {
        let compiler = new MockCompiler();

        test.test('basic', (test) => {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1, 1);
            let node = new TwingNodeInclude(expr, null, false, false, 1, 1);

            test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, \`foo.twig\`, undefined, true, false, 1));
`);
            test.end();
        });

        test.test('with condition', (test) => {
            let expr = new TwingNodeExpressionConditional(
                new TwingNodeExpressionConstant(true, 1, 1),
                new TwingNodeExpressionConstant('foo', 1, 1),
                new TwingNodeExpressionConstant('foo', 1, 1),
                0, 1
            );
            let node = new TwingNodeInclude(expr, null, false, false, 1, 1);

            test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, ((true) ? (\`foo\`) : (\`foo\`)), undefined, true, false, 1));
`);
            test.end();
        });

        test.test('with variables', (test) => {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1, 1);

            let hashNodes = new Map([
                [0, new TwingNodeExpressionConstant('foo', 1, 1)],
                [1, new TwingNodeExpressionConstant(true, 1, 1)]
            ]);

            let vars = new TwingNodeExpressionHash(hashNodes, 1, 1);
            let node = new TwingNodeInclude(expr, vars, false, false, 1, 1);

            test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, \`foo.twig\`, new Map([[\`foo\`, true]]), true, false, 1));
`);
            test.end();
        });

        test.test('with variables only', (test) => {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1, 1);

            let hashNodes = new Map([
                [0, new TwingNodeExpressionConstant('foo', 1, 1)],
                [1, new TwingNodeExpressionConstant(true, 1, 1)]
            ]);

            let vars = new TwingNodeExpressionHash(hashNodes, 1, 1);

            let node = new TwingNodeInclude(expr, vars, true, false, 1, 1);

            test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, \`foo.twig\`, new Map([[\`foo\`, true]]), false, false, 1));
`);
            test.end();
        });

        test.test('with only and no variables', (test) => {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1, 1);
            let node = new TwingNodeInclude(expr, null, true, false, 1, 1);

            test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, \`foo.twig\`, undefined, false, false, 1));
`);
            test.end();
        });

        test.test('with ignore missing', (test) => {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1, 1);

            let hashNodes = new Map([
                [0, new TwingNodeExpressionConstant('foo', 1, 1)],
                [1, new TwingNodeExpressionConstant(true, 1, 1)]
            ]);

            let vars = new TwingNodeExpressionHash(hashNodes, 1, 1);

            let node = new TwingNodeInclude(expr, vars, true, true, 1, 1);

            test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, \`foo.twig\`, new Map([[\`foo\`, true]]), false, true, 1));
`);
            test.end();
        });

        test.end();
    });

    test.end();
});
