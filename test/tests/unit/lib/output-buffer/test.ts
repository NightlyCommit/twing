import * as tape from 'tape';
import {TwingOutputBuffer} from "../../../../../src/lib/output-buffer";

const sinon = require('sinon');

const outputBuffer = new TwingOutputBuffer();

let reset = (restart = true) => {
    while (outputBuffer.getLevel()) {
        outputBuffer.endAndClean();
    }

    if (restart) {
        outputBuffer.start();
        outputBuffer.echo('foo');
        outputBuffer.start();
        outputBuffer.echo('bar');
        outputBuffer.start();
        outputBuffer.echo('oof');
    }
};

tape('TwingOutputBuffering', (test) => {
    test.test('echo', (test) => {
        let data = '';

        let stdoutWrite = process.stdout.write;
        let i = 0;

        process.stdout.write = function (chunk: string) {
            data += chunk;

            if (i === 1) {
                process.stdout.write = stdoutWrite;
            }

            i++;

            return true;
        };

        outputBuffer.echo('foo');
        outputBuffer.echo('bar');

        test.same(data, 'foobar', 'process.stdout should contain "foobar"');
        test.end();
    });

    test.test('echo without process.stdout', (test) => {
        let stdout = process.stdout;

        delete process.stdout;

        let logSpy = sinon.spy(console, 'log');

        outputBuffer.echo('foo');
        outputBuffer.echo('bar');

        process.stdout = stdout;

        test.same(logSpy.callCount, 2, 'console.log should be called twice');
        test.end();
    });

    test.test('obStart', (test) => {
        outputBuffer.start();

        test.equal(outputBuffer.getLevel(), 1, 'getLevel() should return 1');

        outputBuffer.start();

        test.equal(outputBuffer.getLevel(), 2, 'getLevel() should return 2');
        test.end();
    });

    test.test('obEndFlush', (test) => {
        reset();
        outputBuffer.endAndFlush();

        test.equal(outputBuffer.getLevel(), 2, 'getLevel() should return 2');
        test.same(outputBuffer.getContents(), 'baroof', `obGetContents() should return 'baroof'`);

        reset(false);

        let originalWrite = process.stdout.write;

        process.stdout.write = function (chunk: string): boolean {
            process.stdout.write = originalWrite;

            test.same(chunk, 'Failed to delete and flush buffer: no buffer to delete or flush.');

            return true;
        };

        test.false(outputBuffer.endAndFlush());

        test.end();
    });

    test.test('obFlush', (test) => {
        reset();
        outputBuffer.flush();

        test.same(outputBuffer.getContents(), '', `obGetContents() should return ''`);

        reset(false);

        let originalWrite = process.stdout.write;

        process.stdout.write = function (chunk: string): boolean {
            process.stdout.write = originalWrite;

            test.same(chunk, 'Failed to flush buffer: no buffer to flush.');

            return true;
        };

        test.false(outputBuffer.flush());

        test.end();
    });

    test.test('obGetFlush', (test) => {
        reset();

        test.same(outputBuffer.getAndFlush(), 'oof', `obGetFlush() should return 'oof'`);
        test.same(outputBuffer.getContents(), 'baroof', `obGetContents() should return 'baroof'`);

        test.end();
    });

    test.test('obClean', (test) => {
        reset();
        outputBuffer.clean();

        test.equal(outputBuffer.getLevel(), 3, 'getLevel() should return 3');
        test.same(outputBuffer.getContents(), '', `obGetContents() should return ''`);

        reset(false);

        let originalWrite = process.stdout.write;

        process.stdout.write = function (chunk: string): boolean {
            process.stdout.write = originalWrite;

            test.same(chunk, 'Failed to clean buffer: no buffer to clean.');

            return true;
        };

        test.false(outputBuffer.clean());

        test.end();
    });

    test.test('obGetClean', (test) => {
        reset();

        test.same(outputBuffer.getAndClean(), 'oof', `obGetClean() should return 'oof'`);

        test.end();
    });

    test.test('obEndClean', (test) => {
        reset();

        test.true(outputBuffer.endAndClean(), `obEndClean() should return trusty`);
        test.equal(outputBuffer.getLevel(), 2, 'getLevel() should return 2');
        test.same(outputBuffer.getContents(), 'bar', `obGetContents() should return 'bar'`);

        reset(false);

        let originalWrite = process.stdout.write;

        process.stdout.write = function (chunk: string): boolean {
            process.stdout.write = originalWrite;

            return true;
        };

        test.false(outputBuffer.endAndClean());

        test.end();
    });

    test.test('flush', (test) => {
        reset();
        outputBuffer.flush();

        test.same(outputBuffer.getContents(), '', `obGetContents() should return ''`);

        test.end();
    });

    test.test('support echoing a number when not started', (test) => {
        let w = process.stdout.write;

        return new Promise((resolve, reject) => {
            reset(false);

            process.stdout.write = function (chunk: string): boolean {
                resolve(chunk.toString());

                return true;
            };

            outputBuffer.echo(1);
        }).then(function (actual) {
            process.stdout.write = w;

            test.same(actual, '1');

            test.end();
        });
    });

    test.test('obGetLevel', (test) => {
        reset(false);

        test.equals(outputBuffer.getLevel(), 0);

        test.end();
    });

    test.test('obGetContents', (test) => {
        reset(false);

        test.equals(outputBuffer.getContents(), false);

        test.end();
    });


    test.end();
});
