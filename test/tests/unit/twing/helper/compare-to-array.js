const compareToArray = require('../../../../../lib/twing/helper/compare-to-array').compareToArray;

const tap = require('tap');

let arrayEmpty= [];
let arrayNonEmpty= ['php'];
let arrayNonEmpty2= ['js'];
let arrayNonEmpty3= ['php', 'js'];

tap.test('compare-to-array', function (test) {
    test.test('should conform to PHP loose comparisons rules', function (test) {
        test.equal(compareToArray(arrayEmpty, true), false, '([] == true) === false');
        test.equal(compareToArray(arrayEmpty, false), true, '([] == false) === true');
        test.equal(compareToArray(arrayEmpty, 1), false, '([] == 1) === false');
        test.equal(compareToArray(arrayEmpty, 0), false, '([] == 0) === false');
        test.equal(compareToArray(arrayEmpty, -1), false, '([] == -1) === false');
        test.equal(compareToArray(arrayEmpty, '1'), false, '([] == "1") === false');
        test.equal(compareToArray(arrayEmpty, '0'), false, '([] == "0") === false');
        test.equal(compareToArray(arrayEmpty, '-1'), false, '([] == "-1") === false');
        test.equal(compareToArray(arrayEmpty, null), true, '([] == null) === true');
        test.equal(compareToArray(arrayEmpty, arrayEmpty), true, '([] == []) === true');
        test.equal(compareToArray(arrayEmpty, arrayNonEmpty), false, '([] == ["php"]) === false');
        test.equal(compareToArray(arrayEmpty, 'php'), false, '([] == "php") === false');
        test.equal(compareToArray(arrayEmpty, ''), false, '([] == "") === false');

        test.equal(compareToArray(arrayNonEmpty, true), true, '(["php"] == true) === true');
        test.equal(compareToArray(arrayNonEmpty, false), false, '(["php"] == false) === false');
        test.equal(compareToArray(arrayNonEmpty, 1), false, '(["php"] == 1) === false');
        test.equal(compareToArray(arrayNonEmpty, 0), false, '(["php"] == 0) === false');
        test.equal(compareToArray(arrayNonEmpty, -1), false, '(["php"] == -1) === false');
        test.equal(compareToArray(arrayNonEmpty, '1'), false, '(["php"] == "1") === false');
        test.equal(compareToArray(arrayNonEmpty, '0'), false, '(["php"] == "0") === false');
        test.equal(compareToArray(arrayNonEmpty, '-1'), false, '(["php"] == "-1") === false');
        test.equal(compareToArray(arrayNonEmpty, null), false, '(["php"] == null) === false');
        test.equal(compareToArray(arrayNonEmpty, arrayEmpty), false, '(["php"] == []) === false');
        test.equal(compareToArray(arrayNonEmpty, arrayNonEmpty), true, '(["php"] == ["php"]) === true');
        test.equal(compareToArray(arrayNonEmpty, arrayNonEmpty2), false, '(["php"] == ["js"]) === false');
        test.equal(compareToArray(arrayNonEmpty, arrayNonEmpty3), false, '(["php"] == ["php", "js"]) === false');
        test.equal(compareToArray(arrayNonEmpty, 'php'), false, '(["php"] == "php") === false');
        test.equal(compareToArray(arrayNonEmpty, ''), false, '(["php"] == "") === false');

        test.end();
    });

    test.end();
});
