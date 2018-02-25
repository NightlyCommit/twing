import {Test} from "tape";
import {twingCompare} from '../../../../src/helper/compare';

const tap = require('tap');

class valueIterable {
    [Symbol.iterator] = function* () {
        yield 'a';
        yield 'b';
    };
}

class keyValueIterable {
    [Symbol.iterator] = function* () {
        yield ['a', 'b'];
        yield ['c', 'd'];
    };
}

let booleanTrue = ['true', true];
let booleanFalse = ['false', false];
let numberOne = ['1', 1];
let numberZero = ['0', 0];
let numberMinusOne = ['-1', -1];
let stringZero = ['"0"', '0'];
let stringDoubleZero = ['"00"', '00'];
let stringOne = ['"1"', '1'];
let stringMinusOne = ['"-1"', '-1'];
let primitiveNull = ['null', null];
let arrayEmpty: Array<any> = ['[]', []];
let stringFilled = ['"php"', 'php'];
let stringEmpty = ['""', ''];

tap.test('equal', function (test: Test) {
    test.test('should conform to PHP loose comparisons rules', function (test: Test) {
        let rules = new Map([
            // TRUE
            [[booleanTrue, booleanTrue], true],
            [[booleanTrue, booleanFalse], false],
            [[booleanTrue, numberOne], true],
            [[booleanTrue, numberZero], false],
            [[booleanTrue, numberMinusOne], true],
            [[booleanTrue, stringOne], true],
            [[booleanTrue, stringZero], false],
            [[booleanTrue, stringDoubleZero], true],
            [[booleanTrue, stringMinusOne], true],
            [[booleanTrue, primitiveNull], false],
            [[booleanTrue, arrayEmpty], false],
            [[booleanTrue, stringFilled], true],
            [[booleanTrue, stringEmpty], false],
            // FALSE
            [[booleanFalse, booleanTrue], false],
            [[booleanFalse, booleanFalse], true],
            [[booleanFalse, numberOne], false],
            [[booleanFalse, numberZero], true],
            [[booleanFalse, numberMinusOne], false],
            [[booleanFalse, stringOne], false],
            [[booleanFalse, stringZero], true],
            [[booleanFalse, stringMinusOne], false],
            [[booleanFalse, primitiveNull], true],
            [[booleanFalse, arrayEmpty], true],
            [[booleanFalse, stringFilled], false],
            [[booleanFalse, stringEmpty], true],
            // 1
            [[numberOne, booleanTrue], true],
            [[numberOne, booleanFalse], false],
            [[numberOne, numberOne], true],
            [[numberOne, numberZero], false],
            [[numberOne, numberMinusOne], false],
            [[numberOne, stringOne], true],
            [[numberOne, stringZero], false],
            [[numberOne, stringMinusOne], false],
            [[numberOne, primitiveNull], false],
            [[numberOne, arrayEmpty], false],
            [[numberOne, stringFilled], false],
            [[numberOne, stringEmpty], false],
            // 0
            [[numberZero, booleanTrue], false],
            [[numberZero, booleanFalse], true],
            [[numberZero, numberOne], false],
            [[numberZero, numberZero], true],
            [[numberZero, numberMinusOne], false],
            [[numberZero, stringOne], false],
            [[numberZero, stringZero], true],
            [[numberZero, stringMinusOne], false],
            [[numberZero, primitiveNull], true],
            [[numberZero, arrayEmpty], false],
            [[numberZero, stringFilled], true],
            [[numberZero, stringEmpty], true],
            // -1
            [[numberMinusOne, booleanTrue], true],
            [[numberMinusOne, booleanFalse], false],
            [[numberMinusOne, numberOne], false],
            [[numberMinusOne, numberZero], false],
            [[numberMinusOne, numberMinusOne], true],
            [[numberMinusOne, stringOne], false],
            [[numberMinusOne, stringZero], false],
            [[numberMinusOne, stringMinusOne], true],
            [[numberMinusOne, primitiveNull], false],
            [[numberMinusOne, arrayEmpty], false],
            [[numberMinusOne, stringFilled], false],
            [[numberMinusOne, stringEmpty], false],
            // "1"
            [[stringOne, booleanTrue], true],
            [[stringOne, booleanFalse], false],
            [[stringOne, numberOne], true],
            [[stringOne, numberZero], false],
            [[stringOne, numberMinusOne], false],
            [[stringOne, stringOne], true],
            [[stringOne, stringZero], false],
            [[stringOne, stringMinusOne], false],
            [[stringOne, primitiveNull], false],
            [[stringOne, arrayEmpty], false],
            [[stringOne, stringFilled], false],
            [[stringOne, stringEmpty], false],
            // "0"
            [[stringZero, booleanTrue], false],
            [[stringZero, booleanFalse], true],
            [[stringZero, numberOne], false],
            [[stringZero, numberZero], true],
            [[stringZero, numberMinusOne], false],
            [[stringZero, stringOne], false],
            [[stringZero, stringZero], true],
            [[stringZero, stringMinusOne], false],
            [[stringZero, primitiveNull], false],
            [[stringZero, arrayEmpty], false],
            [[stringZero, stringFilled], false],
            [[stringZero, stringEmpty], false],

            // "-1"
            [[stringMinusOne, booleanTrue], true],
            [[stringMinusOne, booleanFalse], false],
            [[stringMinusOne, numberOne], false],
            [[stringMinusOne, numberZero], false],
            [[stringMinusOne, numberMinusOne], true],
            [[stringMinusOne, stringOne], false],
            [[stringMinusOne, stringZero], false],
            [[stringMinusOne, stringMinusOne], true],
            [[stringMinusOne, primitiveNull], false],
            [[stringMinusOne, arrayEmpty], false],
            [[stringMinusOne, stringFilled], false],
            [[stringMinusOne, stringEmpty], false],
            // NULL
            [[primitiveNull, booleanTrue], false],
            [[primitiveNull, booleanFalse], true],
            [[primitiveNull, numberOne], false],
            [[primitiveNull, numberZero], true],
            [[primitiveNull, numberMinusOne], false],
            [[primitiveNull, stringOne], false],
            [[primitiveNull, stringZero], false],

            [[primitiveNull, stringMinusOne], false],
            [[primitiveNull, primitiveNull], true],
            [[primitiveNull, arrayEmpty], true],
            [[primitiveNull, stringFilled], false],
            [[primitiveNull, stringEmpty], true],
            // "php"
            [[stringFilled, booleanTrue], true],
            [[stringFilled, booleanFalse], false],
            [[stringFilled, numberOne], false],
            [[stringFilled, numberZero], true],
            [[stringFilled, numberMinusOne], false],
            [[stringFilled, stringOne], false],
            [[stringFilled, stringZero], false],
            [[stringFilled, stringMinusOne], false],
            [[stringFilled, primitiveNull], false],
            [[stringFilled, arrayEmpty], false],
            [[stringFilled, stringFilled], true],
            [[stringFilled, stringEmpty], false],
            // ""
            [[stringEmpty, booleanTrue], false],
            [[stringEmpty, booleanFalse], true],
            [[stringEmpty, numberOne], false],
            [[stringEmpty, numberZero], true],
            [[stringEmpty, numberMinusOne], false],
            [[stringEmpty, stringOne], false],
            [[stringEmpty, stringZero], false],
            [[stringEmpty, stringMinusOne], false],
            [[stringEmpty, primitiveNull], true],
            [[stringEmpty, arrayEmpty], false],
            [[stringEmpty, stringFilled], false],
            [[stringEmpty, stringEmpty], true]
        ]);

        for (let [operands, result] of rules) {
            test.equal(twingCompare(operands[0][1], operands[1][1]), result, `(${operands[0][0]} == ${operands[1][0]}) === ${result}`);
        }

        test.end();
    });

    test.end();
});
