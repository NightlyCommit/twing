import * as tape from 'tape';
import {TwingContext} from "../../../../../src/lib/context";

tape('context', (test) => {
    test.test('clone', (test) => {
        let map = new Map([
            ['a', 1],
            ['b', 2]
        ]);

        let context = new TwingContext(map);
        let clone = context.clone();

        clone.set('c', 3);

        test.same(clone.get('a'), context.get('a'));
        test.same(clone.get('b'), context.get('b'));
        test.same(clone.get('c'), 3);
        test.false(context.has('c'));

        test.end();
    });

    test.test('set trap', (test) => {
        let map = new Map();
        let context = new TwingContext(map);

        context.proxy['a'] = 1;

        test.same(map.get('a'), 1);

        test.end();
    });
});