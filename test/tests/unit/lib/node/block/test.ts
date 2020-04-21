import * as tape from 'tape';
import {TwingNodeText} from "../../../../../../src/lib/node/text";
import {TwingNodeBlock} from "../../../../../../src/lib/node/block";
import {TwingNodeType} from "../../../../../../src/lib/node";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/block', (test) => {
    test.test('constructor', (test) => {
        let body = new TwingNodeText('foo', 1, 1, null);
        let node = new TwingNodeBlock('foo', body, 1, 1);

        test.same(node.getNode('body'), body);
        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.BLOCK);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', (test) => {
        let body = new TwingNodeText('foo', 1, 1, null);
        let node = new TwingNodeBlock('foo', body, 1, 1);
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `async (context, outputBuffer, blocks = new Map()) => {
    let aliases = this.aliases.clone();
    outputBuffer.echo(\`foo\`);
}`);

        test.end();
    });

    test.end();
});
