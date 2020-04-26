import * as tape from 'tape';
import {TwingNodeFlush, type} from "../../../../../../src/lib/node/flush";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/flush', (test) => {
    test.test('constructor', (test) => {
        let node = new TwingNodeFlush(1, 1, 'foo');

        test.same(node.getNodes(), new Map());
        test.same(node.type, type);

        test.end();
    });

    test.test('compile', (test) => {
        let node = new TwingNodeFlush(1, 1, 'foo');
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `outputBuffer.flush();
`);

        test.end();
    });

    test.end();
});
