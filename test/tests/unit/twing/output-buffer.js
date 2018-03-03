const TwingOutputBuffer = require('../../../../lib/twing/output-buffer').TwingOutputBuffer;

const tap = require('tap');

let reset = () => {
    while (TwingOutputBuffer.obGetLevel()) {
        TwingOutputBuffer.obEndClean();
    }

    TwingOutputBuffer.obStart();
    TwingOutputBuffer.echo('foo');
    TwingOutputBuffer.obStart();
    TwingOutputBuffer.echo('bar');
    TwingOutputBuffer.obStart();
    TwingOutputBuffer.echo('oof');
};

tap.test('TwingOutputBuffer', function (test) {
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

        TwingOutputBuffer.echo('foo');
        TwingOutputBuffer.echo('bar');

        test.same(data, 'foobar', 'process.stdout should contain "foobar"');
        test.end();
    });

    test.test('obStart', function (test) {
        TwingOutputBuffer.obStart();

        test.equal(TwingOutputBuffer.obGetLevel(), 1, 'obGetLevel() should return 1');

        TwingOutputBuffer.obStart();

        test.equal(TwingOutputBuffer.obGetLevel(), 2, 'obGetLevel() should return 2');
        test.end();
    });

    test.test('obEndFlush', function (test) {
        reset();
        TwingOutputBuffer.obEndFlush();

        test.equal(TwingOutputBuffer.obGetLevel(), 2, 'obGetLevel() should return 2');
        test.same(TwingOutputBuffer.obGetContents(), 'baroof', `obGetContents() should return 'baroof'`);

        test.end();
    });

    test.test('obFlush', function (test) {
        reset();
        TwingOutputBuffer.obFlush();

        test.same(TwingOutputBuffer.obGetContents(), '', `obGetContents() should return ''`);
        test.end();
    });

    test.test('obGetFlush', function (test) {
        reset();

        test.same(TwingOutputBuffer.obGetFlush(), 'oof', `obGetFlush() should return 'oof'`);
        test.same(TwingOutputBuffer.obGetContents(), 'baroof', `obGetContents() should return 'baroof'`);

        test.end();
    });

    test.test('obClean', function (test) {
        reset();
        TwingOutputBuffer.obClean();

        test.equal(TwingOutputBuffer.obGetLevel(), 3, 'obGetLevel() should return 3');
        test.same(TwingOutputBuffer.obGetContents(), '', `obGetContents() should return ''`);
        test.end();
    });

    test.test('obGetClean', function (test) {
        reset();

        test.same(TwingOutputBuffer.obGetClean(), 'oof', `obGetClean() should return 'oof'`);

        test.end();
    });

    test.test('obEndClean', function (test) {
        reset();

        test.true(TwingOutputBuffer.obEndClean(), `obEndClean() should return trusty`);
        test.equal(TwingOutputBuffer.obGetLevel(), 2, 'obGetLevel() should return 2');
        test.same(TwingOutputBuffer.obGetContents(), 'bar', `obGetContents() should return 'bar'`);

        test.end();
    });

    test.test('flush', function (test) {
        reset();
        TwingOutputBuffer.flush();

        test.same(TwingOutputBuffer.obGetContents(), '', `obGetContents() should return ''`);
        test.end();
    });

    test.end();
});
