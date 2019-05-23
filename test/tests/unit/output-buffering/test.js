const {TwingOutputBuffering} = require('../../../../build/output-buffering');

const tap = require('tape');
const sinon = require('sinon');

let reset = (restart = true) => {
    while (TwingOutputBuffering.obGetLevel()) {
        TwingOutputBuffering.obEndClean();
    }

    if (restart) {
        TwingOutputBuffering.obStart();
        TwingOutputBuffering.echo('foo');
        TwingOutputBuffering.obStart();
        TwingOutputBuffering.echo('bar');
        TwingOutputBuffering.obStart();
        TwingOutputBuffering.echo('oof');
    }
};

tap.test('TwingOutputBuffering', function (test) {
    test.test('echo', function (test) {
        let data = '';

        let stdoutWrite = process.stdout.write;
        let i = 0;

        process.stdout.write = function (chunk) {
            data += chunk;

            if (i === 1) {
                process.stdout.write = stdoutWrite;
            }

            i++;

            return true;
        };

        TwingOutputBuffering.echo('foo');
        TwingOutputBuffering.echo('bar');

        test.same(data, 'foobar', 'process.stdout should contain "foobar"');
        test.end();
    });

    test.test('echo without process.stdout', function (test) {
        let stdout = process.stdout;

        delete process.stdout;

        let logSpy = sinon.spy(console, 'log');

        TwingOutputBuffering.echo('foo');
        TwingOutputBuffering.echo('bar');

        process.stdout = stdout;

        test.same(logSpy.callCount, 2, 'console.log should be called twice');
        test.end();
    });

    test.test('obStart', function (test) {
        TwingOutputBuffering.obStart();

        test.equal(TwingOutputBuffering.obGetLevel(), 1, 'obGetLevel() should return 1');

        TwingOutputBuffering.obStart();

        test.equal(TwingOutputBuffering.obGetLevel(), 2, 'obGetLevel() should return 2');
        test.end();
    });

    test.test('obEndFlush', function (test) {
        reset();
        TwingOutputBuffering.obEndFlush();

        test.equal(TwingOutputBuffering.obGetLevel(), 2, 'obGetLevel() should return 2');
        test.same(TwingOutputBuffering.obGetContents(), 'baroof', `obGetContents() should return 'baroof'`);

        reset(false);

        let originalWrite = process.stdout.write;

        process.stdout.write = function (chunk) {
            process.stdout.write = originalWrite;

            test.same(chunk, 'Failed to delete and flush buffer: no buffer to delete or flush.');
        };

        test.false(TwingOutputBuffering.obEndFlush());

        test.end();
    });

    test.test('obFlush', function (test) {
        reset();
        TwingOutputBuffering.obFlush();

        test.same(TwingOutputBuffering.obGetContents(), '', `obGetContents() should return ''`);

        reset(false);

        let originalWrite = process.stdout.write;

        process.stdout.write = function (chunk) {
            process.stdout.write = originalWrite;

            test.same(chunk, 'Failed to flush buffer: no buffer to flush.');
        };

        test.false(TwingOutputBuffering.obFlush());

        test.end();
    });

    test.test('obGetFlush', function (test) {
        reset();

        test.same(TwingOutputBuffering.obGetFlush(), 'oof', `obGetFlush() should return 'oof'`);
        test.same(TwingOutputBuffering.obGetContents(), 'baroof', `obGetContents() should return 'baroof'`);

        test.end();
    });

    test.test('obClean', function (test) {
        reset();
        TwingOutputBuffering.obClean();

        test.equal(TwingOutputBuffering.obGetLevel(), 3, 'obGetLevel() should return 3');
        test.same(TwingOutputBuffering.obGetContents(), '', `obGetContents() should return ''`);

        reset(false);

        let originalWrite = process.stdout.write;

        process.stdout.write = function (chunk) {
            process.stdout.write = originalWrite;

            test.same(chunk, 'Failed to clean buffer: no buffer to clean.');
        };

        test.false(TwingOutputBuffering.obClean());

        test.end();
    });

    test.test('obGetClean', function (test) {
        reset();

        test.same(TwingOutputBuffering.obGetClean(), 'oof', `obGetClean() should return 'oof'`);

        test.end();
    });

    test.test('obEndClean', function (test) {
        reset();

        test.true(TwingOutputBuffering.obEndClean(), `obEndClean() should return trusty`);
        test.equal(TwingOutputBuffering.obGetLevel(), 2, 'obGetLevel() should return 2');
        test.same(TwingOutputBuffering.obGetContents(), 'bar', `obGetContents() should return 'bar'`);

        reset(false);

        let originalWrite = process.stdout.write;

        process.stdout.write = function (chunk) {
            process.stdout.write = originalWrite;
        };

        test.false(TwingOutputBuffering.obEndClean());

        test.end();
    });

    test.test('flush', function (test) {
        reset();
        TwingOutputBuffering.flush();

        test.same(TwingOutputBuffering.obGetContents(), '', `obGetContents() should return ''`);

        test.end();
    });

    test.test('support echoing a number when not started', function (test) {
        let w = process.stdout.write;

        return new Promise((resolve, reject) => {
            reset(false);

            process.stdout.write = function (chunk) {
                resolve(chunk.toString());
            };

            TwingOutputBuffering.echo(1);
        }).then(function (actual) {
            process.stdout.write = w;

            test.same(actual, '1');

            test.end();
        });
    });

    test.test('obGetLevel', function (test) {
        reset(false);

        test.equals(TwingOutputBuffering.obGetLevel(), 0);

        test.end();
    });

    test.test('obGetContents', function (test) {
        reset(false);

        test.equals(TwingOutputBuffering.obGetContents(), false);

        test.end();
    });


    test.end();
});
