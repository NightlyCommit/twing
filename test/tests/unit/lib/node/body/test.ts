import * as tape from 'tape';
import {TwingNodeBody} from "../../../../../../src/lib/node/body";

tape('node/body', (test) => {
    test.test('constructor', (test) => {
        let node = new TwingNodeBody();

        test.same(node.getNodes(), new Map());

        test.end();
    });

    test.end();
});