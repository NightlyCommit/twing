import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionTestConstant} from "../../../../../../../../src/lib/node/expression/test/constant";
import {TwingNodeExpressionArray} from "../../../../../../../../src/lib/node/expression/array";
import {MockCompiler} from "../../../../../../../mock/compiler";

tape('node/expression/test/constant', (test) => {
    test.test('compile', (test) => {
        let node = new TwingNodeExpressionTestConstant(
            new TwingNodeExpressionConstant('foo', 1, 1),
            'constant',
            new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant('Foo', 1, 1)]
            ]), 1, 1),
            1, 1
        );
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), '(`foo` === this.constant(`Foo`))');

        node = new TwingNodeExpressionTestConstant(
            new TwingNodeExpressionConstant('foo', 1, 1),
            'constant',
            new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant('Foo', 1, 1)],
                [1, new TwingNodeExpressionConstant('Bar', 1, 1)]
            ]), 1, 1),
            1, 1
        );

        test.same(compiler.compile(node).getSource(), '(`foo` === this.constant(`Foo`, `Bar`))');

        test.end();
    });

    test.end();
});
