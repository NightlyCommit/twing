import * as tape from 'tape';
import {TwingNodeText} from "../../../../../../src/lib/node/text";
import {TwingNode} from "../../../../../../src/lib/node";
import {TwingNodeAutoEscape, type} from "../../../../../../src/lib/node/auto-escape";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/autoescape', (test) => {
    test.test('constructor', (test) => {
        let bodyNodes = new Map([
            [0, new TwingNodeText('foo', 1, 1)]
        ]);

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeAutoEscape(true, body, 1, 1);

        test.same(node.getNode('body'), body);
        test.true(node.getAttribute('value'));
        test.same(node.type, type);

        test.end();
    });

    test.test('compile', (test) => {
        let bodyNodes = new Map([
            [0, new TwingNodeText('foo', 1, 1)]
        ]);

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeAutoEscape(true, body, 1, 1);
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `outputBuffer.echo(\`foo\`);
`);

        test.end();
    });

    test.end();
});
