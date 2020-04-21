import * as tape from 'tape';
import {TwingNodeVerbatim, type} from "../../../../../../src/lib/node/verbatim";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/verbatim', (test) => {
    test.test('constructor', (test) => {
        let node = new TwingNodeVerbatim('foo', 1, 1, 'verbatim');

        test.same(node.getAttribute('data'), 'foo');
        test.same(node.type, type);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);
        test.same(node.getNodeTag(), 'verbatim');

        test.end();
    });

    test.test('compile', (test) => {
        let node = new TwingNodeVerbatim('foo', 1, 1, 'verbatim');
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `outputBuffer.echo(\`foo\`);
`);

        test.end();
    });

    test.end();
});
