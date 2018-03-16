const tap = require('tap');
const iconv = require('../../../../../lib/twing/helper/iconv').iconv;

tap.test('iconv', function(test) {
    test.test('is non destructive', function(test) {
        test.same(iconv('ISO-8859-1', 'UTF-8', iconv('UTF-8', 'ISO-8859-1', new Buffer('Äé'))).toString(), 'Äé');

        test.end();
    });

    test.end();
});