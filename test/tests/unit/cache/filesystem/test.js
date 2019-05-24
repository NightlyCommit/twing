const {TwingCacheFilesystem} = require('../../../../../build/cache/filesystem');

const tap = require('tape');
const {resolve: resolvePath, join: joinPaths} = require('path');
const fs = require('fs-extra');
const sinon = require('sinon');

let fixturesPath = resolvePath('test/tests/unit/cache/filesystem/fixtures');

tap.test('cache filesystem', function (test) {
    let cache = new TwingCacheFilesystem(fixturesPath);

    test.test('load', function (test) {
        test.test('should bypass require cache', function (test) {
            let load1 = cache.load(joinPaths(fixturesPath, 'template.js'));
            let load2 = cache.load(joinPaths(fixturesPath, 'template.js'));
            let load3 = cache.load(joinPaths(fixturesPath, 'template.js'));

            test.same(load1(), 1);
            test.same(load2(), 1);
            test.same(load3(), 1);

            test.end();
        });

        test.end();
    });

    test.test('write', function(test) {
        let stub = sinon.stub(fs, 'writeFileSync');

        stub.throws();

        test.throws(function() {
            cache.write('foo', null);
        }, new Error('Failed to write cache file "foo".'));

        stub.restore();

        test.end();
    });

    test.test('getTimestamp', function(test) {
        let stub = sinon.stub(fs, 'statSync');

        stub.returns({
            mtimeMs: 1
        });

        test.equals(cache.getTimestamp(__filename), 1);

        stub.restore();

        stub = sinon.stub(fs, 'pathExistsSync');

        stub.returns(false);

        test.false(cache.getTimestamp(__filename));

        stub.restore();

        test.end();
    });

    test.end();
});
