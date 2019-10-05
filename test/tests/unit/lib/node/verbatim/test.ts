import * as tape from 'tape';
import {TwingNodeVerbatim} from "../../../../../../src/lib/node/verbatim";
import {TwingNodeType} from "../../../../../../src/lib/node";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/verbatim', (test) => {
    test.test('constructor', (test) => {
        let node = new TwingNodeVerbatim('foo', 1, 1, 'verbatim');

        test.same(node.getAttribute('data'), 'foo');
        test.same(node.getType(), TwingNodeType.VERBATIM);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);
        test.same(node.getNodeTag(), 'verbatim');

        test.end();
    });

    test.test('compile', (test) => {
        let node = new TwingNodeVerbatim('foo', 1, 1, 'verbatim');
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `this.echo(\`foo\`);
`);

        test.end();
    });

    test.end();
});
