import * as tape from 'tape';
import {Test} from "tape";
import {stub} from "sinon";
import {TwingCacheFilesystem} from "../../../../../../src/lib/cache/filesystem";

const nodePath = require('path');
const fs = require('fs-extra');

let fixturesPath = nodePath.resolve('test/tests/unit/lib/cache/filesystem/fixtures');

tape('cache filesystem', (test: Test) => {
    let cache = new TwingCacheFilesystem(fixturesPath);

    test.test('load', (test) => {
        test.same(cache.load('unknown')(null), new Map());

        test.test('should bypass require cache', (test) => {
            let load1 = cache.load(nodePath.join(fixturesPath, 'template.js'));
            let load2 = cache.load(nodePath.join(fixturesPath, 'template.js'));
            let load3 = cache.load(nodePath.join(fixturesPath, 'template.js'));

            test.same(load1(null), 1);
            test.same(load2(null), 1);
            test.same(load3(null), 1);

            test.end();
        });

        test.end();
    });

    test.test('write', function(test) {
        let stubWriteFileSync = stub(fs, 'writeFileSync');

        stubWriteFileSync.throws();

        try {
            cache.write('foo', null);

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Failed to write cache file "foo".');
        }

        stubWriteFileSync.restore();

        test.end();
    });

    test.test('getTimestamp', function(test) {
        let stubStatSync = stub(fs, 'statSync');

        stubStatSync.returns({
            mtimeMs: 1
        });

        test.equals(cache.getTimestamp(__filename), 1);

        stubStatSync.restore();

        let stubPathExistsSync = stub(fs, 'pathExistsSync');

        stubPathExistsSync.returns(false);

        test.false(cache.getTimestamp(__filename));

        stubPathExistsSync.restore();

        test.end();
    });

    test.end();
});
