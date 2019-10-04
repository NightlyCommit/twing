import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionHash} from "../../../../../../../src/lib/node/expression/hash";
import {MockCompiler} from "../../../../../../mock/compiler";

tape('node/expression/hash', (test) => {
    test.test('constructor', (test) => {
        let barNode = new TwingNodeExpressionConstant('bar', 1, 1);

        let elements = new Map([
            ['0', new TwingNodeExpressionConstant('foo', 1, 1)],
            ['1', barNode]
        ]);

        let node = new TwingNodeExpressionHash(elements, 1, 1);

        test.same(node.getNode('1'), barNode);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', (test) => {
        let compiler = new MockCompiler();

        let elements = new Map([
            ['0', new TwingNodeExpressionConstant('foo', 1, 1)],
            ['1', new TwingNodeExpressionConstant('bar', 1, 1)],
            ['2', new TwingNodeExpressionConstant('bar', 1, 1)],
            ['3', new TwingNodeExpressionConstant('foo', 1, 1)]
        ]);

        let node = new TwingNodeExpressionHash(elements, 1, 1);

        test.same(compiler.compile(node).getSource(), 'new Map([[\`foo\`, \`bar\`], [\`bar\`, \`foo\`]])');

        test.end();
    });

    test.end();
});
