const TwingCacheFilesystem = require('../../../../../lib/twing/cache/filesystem').TwingCacheFilesystem;

const tap = require('tap');
const nodePath = require('path');

let fixturesPath = nodePath.resolve('test/tests/unit/twing/cache/fixtures');

tap.test('cache filesystem', function (test) {
    let cache = new TwingCacheFilesystem(fixturesPath);

    test.test('load', function (test) {
        test.test('should bypass require cache', function (test) {
            let load1 = cache.load(nodePath.join(fixturesPath, 'template.js'));
            let load2 = cache.load(nodePath.join(fixturesPath, 'template.js'));
            let load3 = cache.load(nodePath.join(fixturesPath, 'template.js'));

            test.same(load1(), 1);
            test.same(load2(), 1);
            test.same(load3(), 1);

            test.end();
        });

        test.end();
    });

    test.end();
});
