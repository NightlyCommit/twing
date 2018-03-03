const TwingMarkup = require('../../../../lib/twing/markup').TwingMarkup;

const tap = require('tap');

tap.test('TwingMarkup', function (test) {
    test.test('constructor', function (test) {
        let markup = new TwingMarkup('foo', 'bar');

        test.same(markup.toString(), 'foo');
        test.same(markup.TwingIsSafe, true);

        test.end();
    });

    test.test('count', function (test) {
        let markup = new TwingMarkup('饿', 'utf-8');

        test.same(markup.count(), 1);

        markup = new TwingMarkup('饿', 'EUC-CN');

        test.same(markup.count(), 2);

        test.end();
    });

    test.end();
});
