import * as tape from 'tape';
import {TwingNodeEmbed} from "../../../../../../src/lib/node/embed";
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingCompiler} from "../../../../../../src/lib/compiler";
import {TwingEnvironmentNode} from "../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../src/lib/loader/array";

tape('node/embed', (test) => {
    test.test('compile', (test) => {
        let node = new TwingNodeEmbed('foo', 1, new TwingNodeExpressionConstant('bar', 1, 1), false, false, 1, 1, 'embed');
        let compiler = new TwingCompiler(new TwingEnvironmentNode(new TwingLoaderArray({})));

        test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, this.loadTemplate(\`foo\`, null, 1, 1), \`bar\`, true, false, 1));
`);

        test.end();
    });

    test.end();
});