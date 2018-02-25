import {Test} from "tape";
import {TwingCacheFilesystem} from "../../../../src/cache/filesystem";

const tap = require('tap');
const nodePath = require('path');

let fixturesPath = nodePath.resolve('test/tests/unit/cache/fixtures');

tap.test('cache filesystem', function (test: Test) {
    let cache = new TwingCacheFilesystem(fixturesPath);

    test.test('load', function (test: Test) {
        test.test('should bypass require cache', function (test: Test) {
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
