import * as tape from 'tape';
import {reduce} from "../../../../../../../../src/lib/extension/core/filters/reduce";

tape('reduce', (test) => {
    test.test('sync callback', (test) => {
        test.test('without initial value', (test) => {
            reduce(new Map([
                [0, 1],
                [1, -1],
                [2, 4]
            ]), (accumulator, current) => {
                return accumulator + current + 3;
            }).then((result) => {
                test.same(result, 13);

                test.end();
            });
        });

        test.test('with initial value', (test) => {
            reduce(new Map([
                [0, 1],
                [1, -1],
                [2, 4]
            ]), (accumulator, current) => {
                return accumulator + current + 3;
            }, 10).then((result) => {
                test.same(result, 23);

                test.end();
            });
        });

        test.end();
    });

    test.test('async callback', (test) => {
        test.test('without initial value', (test) => {
            reduce(new Map([
                [0, 1],
                [1, -1],
                [2, 4]
            ]), (accumulator, current) => {
                return Promise.resolve(accumulator + current + 3);
            }).then((result) => {
                test.same(result, 13);

                test.end();
            });
        });

        test.test('with initial value', (test) => {
            reduce(new Map([
                [0, 1],
                [1, -1],
                [2, 4]
            ]), (accumulator, current) => {
                return Promise.resolve(accumulator + current + 3);
            }, Promise.resolve(10)).then((result) => {
                test.same(result, 23);

                test.end();
            });
        });

        test.end();
    });

    test.end();
});
