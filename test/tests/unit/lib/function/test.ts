import * as tape from 'tape';
import {TwingFunction} from "../../../../../src/lib/function";
import {TwingNode} from "../../../../../src/lib/node";

tape('function', (test) => {
    test.test('getSafe', (test) => {
        let function_ = new TwingFunction('foo', () => Promise.resolve(), [], {
            is_safe_callback: () => {
                return 'html'
            }
        });

        test.same(function_.getSafe(new TwingNode()), 'html');

        test.end();
    });

    test.end();
});
