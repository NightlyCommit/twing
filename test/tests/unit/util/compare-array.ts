import {Test} from "tape";
import {twingCompareArray as compareArray} from '../../../../src/helper/compare-to-array';

const tap = require('tap');

let arrayEmpty: Array<any> = [];
let arrayNonEmpty: Array<any> = ['php'];
let arrayNonEmpty2: Array<any> = ['js'];
let arrayNonEmpty3: Array<any> = ['php', 'js'];

tap.test('compare-array', function (test: Test) {
    test.test('should conform to PHP loose comparisons rules', function (test: Test) {
        test.equal(compareArray(arrayEmpty, true), false, '([] == true) === false');
        test.equal(compareArray(arrayEmpty, false), true, '([] == false) === true');
        test.equal(compareArray(arrayEmpty, 1), false, '([] == 1) === false');
        test.equal(compareArray(arrayEmpty, 0), false, '([] == 0) === false');
        test.equal(compareArray(arrayEmpty, -1), false, '([] == -1) === false');
        test.equal(compareArray(arrayEmpty, '1'), false, '([] == "1") === false');
        test.equal(compareArray(arrayEmpty, '0'), false, '([] == "0") === false');
        test.equal(compareArray(arrayEmpty, '-1'), false, '([] == "-1") === false');
        test.equal(compareArray(arrayEmpty, null), true, '([] == null) === true');
        test.equal(compareArray(arrayEmpty, arrayEmpty), true, '([] == []) === true');
        test.equal(compareArray(arrayEmpty, arrayNonEmpty), false, '([] == ["php"]) === false');
        test.equal(compareArray(arrayEmpty, 'php'), false, '([] == "php") === false');
        test.equal(compareArray(arrayEmpty, ''), false, '([] == "") === false');

        test.equal(compareArray(arrayNonEmpty, true), true, '(["php"] == true) === true');
        test.equal(compareArray(arrayNonEmpty, false), false, '(["php"] == false) === false');
        test.equal(compareArray(arrayNonEmpty, 1), false, '(["php"] == 1) === false');
        test.equal(compareArray(arrayNonEmpty, 0), false, '(["php"] == 0) === false');
        test.equal(compareArray(arrayNonEmpty, -1), false, '(["php"] == -1) === false');
        test.equal(compareArray(arrayNonEmpty, '1'), false, '(["php"] == "1") === false');
        test.equal(compareArray(arrayNonEmpty, '0'), false, '(["php"] == "0") === false');
        test.equal(compareArray(arrayNonEmpty, '-1'), false, '(["php"] == "-1") === false');
        test.equal(compareArray(arrayNonEmpty, null), false, '(["php"] == null) === false');
        test.equal(compareArray(arrayNonEmpty, arrayEmpty), false, '(["php"] == []) === false');
        test.equal(compareArray(arrayNonEmpty, arrayNonEmpty), true, '(["php"] == ["php"]) === true');
        test.equal(compareArray(arrayNonEmpty, arrayNonEmpty2), false, '(["php"] == ["js"]) === false');
        test.equal(compareArray(arrayNonEmpty, arrayNonEmpty3), false, '(["php"] == ["php", "js"]) === false');
        test.equal(compareArray(arrayNonEmpty, 'php'), false, '(["php"] == "php") === false');
        test.equal(compareArray(arrayNonEmpty, ''), false, '(["php"] == "") === false');

        test.end();
    });

    test.end();
});