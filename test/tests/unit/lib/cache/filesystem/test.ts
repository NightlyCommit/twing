import * as tape from 'tape';
import {Test} from "tape";
import {stub} from "sinon";
import {TwingCacheFilesystem} from "../../../../../../src/lib/cache/filesystem";
import * as fs from "fs";
import {join, resolve} from "path";

let fixturesPath = resolve('test/tests/unit/lib/cache/filesystem/fixtures');

tape('cache filesystem', (test: Test) => {
    let cache = new TwingCacheFilesystem(fixturesPath);

    test.test('load', async (test) => {
        test.same((await cache.load('unknown'))(null), new Map());

        test.test('should bypass require cache', async (test) => {
            let load1 = await cache.load(join(fixturesPath, 'template.js'));
            let load2 = await cache.load(join(fixturesPath, 'template.js'));
            let load3 = await cache.load(join(fixturesPath, 'template.js'));

            test.same(load1(null), 1);
            test.same(load2(null), 1);
            test.same(load3(null), 1);

            test.end();
        });

        test.end();
    });

    test.test('write', async (test) => {
        let writeFileStub = stub(fs, 'writeFile').callsFake((path, data, cb) => {
            return cb(new Error('foo'));
        });

        try {
            await cache.write('foo', 'bar');

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Failed to write cache file "foo".');
        }

        writeFileStub.restore();

        let renameStub = stub(fs, 'rename').callsFake((oldPath, newPath, cb) => {
            return cb(new Error('foo'));
        });

        try {
            await cache.write('foo', 'bar');

            test.fail();
        }
        catch (e) {
            test.same(e.message, 'Failed to write cache file "foo".');
        }

        renameStub.restore();

        test.end();
    });

    test.test('getTimestamp', async (test) => {
        let statStub = stub(fs, 'stat').callsFake((path, cb) => {
            return cb(null, {
                mtimeMs: 1
            });
        });

        test.same(await cache.getTimestamp(__filename), 1);

        statStub.restore();

        statStub = stub(fs, 'stat').callsFake((path, cb) => {
            return cb(new Error('foo'));
        });

        test.same(await cache.getTimestamp(__filename), 0);

        statStub.restore();

        test.end();
    });

    test.end();
});
