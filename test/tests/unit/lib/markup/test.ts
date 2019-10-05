import * as tape from 'tape';
import {TwingMarkup} from "../../../../../src/lib/markup";

tape('TwingMarkup', (test) => {
    test.test('constructor', (test) => {
        let markup = new TwingMarkup('foo', 'bar');

        test.same(markup.toString(), 'foo');

        test.end();
    });

    test.test('count', (test) => {
        let markup = new TwingMarkup('饿', 'utf-8');

        test.same(markup.count(), 1);

        markup = new TwingMarkup('饿', 'EUC-CN');

        test.same(markup.count(), 2);

        test.end();
    });

    test.end();
});
