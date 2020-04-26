import * as tape from 'tape';
import {TwingNodeText, type} from "../../../../../../src/lib/node/text";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/text', (test) => {
    test.test('constructor', (test) => {
        let node = new TwingNodeText('foo', 1, 1);

        test.same(node.getAttribute('data'), 'foo');
        test.same(node.type, type);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', (test) => {
        let node = new TwingNodeText('foo', 1, 1);
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `outputBuffer.echo(\`foo\`);
`);

        test.end();
    });

    test.end();
});
