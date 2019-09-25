const {date: twingDateConverter} = require('../../../../../../build/lib/extension/core/functions/date');
const {getAttribute: twingGetAttribute} = require('../../../../../../build/lib/helpers/get-attribute');
const {random: twingRandom} = require('../../../../../../build/lib/extension/core/functions/random');
const {include: twingInclude} = require('../../../../../../build/lib/extension/core/functions/include');
const {iconv} = require('../../../../../../build/lib/helpers/iconv');
const {reverse: twingReverseFilter} = require('../../../../../../build/lib/extension/core/filters/reverse');
const {escape: twingEscapeFilter} = require('../../../../../../build/lib/extension/core/filters/escape');
const {isIn: twingInFilter} = require('../../../../../../build/lib/helpers/is-in');
const {first: twingFirst} = require('../../../../../../build/lib/extension/core/filters/first');
const {trim: twingTrimFilter} = require('../../../../../../build/lib/extension/core/filters/trim');
const {slice: twingSlice} = require('../../../../../../build/lib/extension/core/filters/slice');
const {last: twingLast} = require('../../../../../../build/lib/extension/core/filters/last');
const {urlEncode: twingUrlencodeFilter} = require('../../../../../../build/lib/extension/core/filters/url-encode');
const {replace: twingReplaceFilter} = require('../../../../../../build/lib/extension/core/filters/replace');
const {round: twingRound} = require('../../../../../../build/lib/extension/core/filters/round');
const {defaultFilter: twingDefaultFilter} = require('../../../../../../build/lib/extension/core/filters/default');
const {join: twingJoinFilter} = require('../../../../../../build/lib/extension/core/filters/join');
const {formatDateTime} = require('../../../../../../build/lib/helpers/format-date-time');
const {lower: twingLowerFilter} = require('../../../../../../build/lib/extension/core/filters/lower');
const {upper: twingUpperFilter} = require('../../../../../../build/lib/extension/core/filters/upper');
const {length: twingLengthFilter} = require('../../../../../../build/lib/extension/core/filters/length');
const {sort: twingSortFilter} = require('../../../../../../build/lib/extension/core/filters/sort');
const {arrayKeys: twingGetArrayKeysFilter} = require('../../../../../../build/lib/extension/core/filters/array-keys');
const {cycle: twingCycle} = require('../../../../../../build/lib/extension/core/functions/cycle');
const {source: twingSource} = require('../../../../../../build/lib/extension/core/functions/source');
const {column: twingColumnFilter} = require('../../../../../../build/lib/extension/core/filters/column');

const {
    TwingExtensionCore,
    TwingSource,
    TwingErrorRuntime,
    TwingTest,
    TwingLoaderArray,
    TwingLoaderRelativeFilesystem,
    TwingEnvironment,
    TwingErrorLoader,
    TwingTemplate,
    TwingLoaderNull
} = require('../../../../../../build/main');

const {TwingMarkup} = require('../../../../../../build/lib/markup');
const TwingTestMockEnvironment = require('../../../../../mock/environment');
const TwingTestMockLoader = require('../../../../../mock/loader');

const Luxon = require('luxon');

const tap = require('tape');
const range = require('locutus/php/array/range');
const getrandmax = require('locutus/php/math/getrandmax');

let getFilter = function (name) {
    let extension = new TwingExtensionCore();

    for (let filter of extension.getFilters()) {
        if (filter.getName() === name) {
            return filter;
        }
    }
};

/**
 *
 * @param name
 * @returns {TwingTest}
 */
let getTest = function (name) {
    let extension = new TwingExtensionCore();

    for (let test of extension.getTests()) {
        if (test.getName() === name) {
            return test;
        }
    }
};

class Foo {
    constructor() {
        this.oof = 'oof';
    }

    foo() {
        return 'foo';
    }

    getFoo() {
        return 'getFoo';
    }

    getBar() {
        return 'getBar';
    }

    isBar() {
        return 'isBar';
    }

    hasBar() {
        return 'hasBar';
    }

    isOof() {
        return 'isOof';
    }

    hasFooBar() {
        return 'hasFooBar';
    }

    __call() {

    }
}

function foo_escaper_for_test(env, string, charset) {
    return (string ? string : '') + charset;
}

class CoreTestIterator {
    constructor(values, keys, allowValueAccess, maxPosition) {
        this.map = values;
        this.mapKeys = keys;
        this.position = 0;
        this.allowValueAccess = allowValueAccess;
        this.maxPosition = maxPosition === false ? values.length + 1 : maxPosition;
    }

    next() {
        return this.position < this.map.size ? {
            done: false,
            value: [...this.map.values()][this.position++]
        } : {
            done: true
        };
    }

    rewind() {
        this.position = 0;
    }
}

class TwingTestExtensionCoreTemplate extends TwingTemplate {

}

tap.test('TwingExtensionCore', function (test) {
    test.test('constructor', function (test) {
        let extension = new TwingExtensionCore();

        test.same(extension.getDefaultStrategy('foo'), 'html');

        test.end();
    });

    test.test('filter', function (test) {
        test.test('date', function (test) {
            Luxon.Settings.defaultZoneName = 'UTC';

            let filter = getFilter('date');
            let callable = filter.getCallable();
            let env = new TwingTestMockEnvironment(new TwingTestMockLoader());

            let date = Luxon.DateTime.fromObject({
                year: 2001,
                hour: 12
            });

            test.same(callable(env, date), 'January 1, 2001 12:00');
            test.looseEqual(callable(env, date, 'U'), (date.toJSDate().getTime() / 1000));
            test.same(callable(env, date, 'j-U'), '1-' + (date.toJSDate().getTime() / 1000));

            /************/
            /* duration */
            /************/
            let duration;

            // default format
            duration = Luxon.Duration.fromObject({days: 1}); // 1 day exactly

            test.same(callable(env, duration), '1 days', 'should use the default format');

            // microseconds
            duration = Luxon.Duration.fromObject({milliseconds: 2}); // +2000 microseconds exactly

            test.same(callable(env, duration, '%F microseconds'), '002000 microseconds');
            test.same(callable(env, duration, '%f microseconds'), '2000 microseconds');

            // seconds
            duration = Luxon.Duration.fromObject({seconds: 2}); // 2 seconds exactly

            test.same(callable(env, duration, '%S seconds'), '02 seconds');
            test.same(callable(env, duration, '%s seconds'), '2 seconds');

            duration = Luxon.Duration.fromObject({seconds: 2, milliseconds: 6}); // 2 seconds and 6 milliseconds

            test.same(callable(env, duration, '%S seconds'), '02 seconds');
            test.same(callable(env, duration, '%s seconds'), '2 seconds');

            // minutes
            duration = Luxon.Duration.fromObject({minutes: 2}); // 2 minutes exactly

            test.same(callable(env, duration, '%I minutes'), '02 minutes');
            test.same(callable(env, duration, '%i minutes'), '2 minutes');

            duration = Luxon.Duration.fromObject({minutes: 2, seconds: 6}); // 2 minutes and 6 seconds

            test.same(callable(env, duration, '%I minutes'), '02 minutes');
            test.same(callable(env, duration, '%i minutes'), '2 minutes');

            // hours
            duration = Luxon.Duration.fromObject({hours: 2}); // 2 hours exactly

            test.same(callable(env, duration, '%H hours'), '02 hours');
            test.same(callable(env, duration, '%h hours'), '2 hours');

            duration = Luxon.Duration.fromObject({hours: 2, minutes: 6}); // 2 hours and 6 minutes

            test.same(callable(env, duration, '%H hours'), '02 hours');
            test.same(callable(env, duration, '%h hours'), '2 hours');

            // days
            duration = Luxon.Duration.fromObject({days: 2}); // 2 days exactly

            test.same(callable(env, duration, '%D days'), '02 days');
            test.same(callable(env, duration, '%a days'), '2 days');
            test.same(callable(env, duration, '%d days'), '2 days');

            duration = Luxon.Duration.fromObject({days: 2, hours: 6}); // 2 days and 6 hours

            test.same(callable(env, duration, '%D days'), '02 days');
            test.same(callable(env, duration, '%R%D days'), '+02 days', 'should format positive duration with a sign when using %R');
            test.same(callable(env, duration, '%r%D days'), '02 days', 'should format negative duration without a sign when using %r');
            test.same(callable(env, duration, '%a days'), '2 days');
            test.same(callable(env, duration, '%d days'), '2 days');

            duration = Luxon.Duration.fromObject({days: -2}); // -2 days exactly

            test.same(callable(env, duration, '%D days'), '02 days', 'should format negative duration without a sign by default');
            test.same(callable(env, duration, '%R%D days'), '-02 days', 'should format negative duration with a sign when using %R');
            test.same(callable(env, duration, '%r%D days'), '-02 days', 'should format negative duration with a sign when using %r');

            // months
            duration = Luxon.Duration.fromObject({months: 2}); // 2 months exactly

            test.same(callable(env, duration, '%M months'), '02 months');
            test.same(callable(env, duration, '%m months'), '2 months');

            duration = Luxon.Duration.fromObject({months: 2, days: 6}); // 2 months and 6 days

            test.same(callable(env, duration, '%M months'), '02 months');
            test.same(callable(env, duration, '%m months'), '2 months');

            // years
            duration = Luxon.Duration.fromObject({years: 2}); // 2 years exactly

            test.same(callable(env, duration, '%Y years'), '02 years');
            test.same(callable(env, duration, '%y years'), '2 years');

            duration = Luxon.Duration.fromObject({years: 2, months: 6}); // 2 years and 6 months

            test.same(callable(env, duration, '%Y years'), '02 years');
            test.same(callable(env, duration, '%y years'), '2 years');

            // years
            duration = Luxon.Duration.fromObject({years: 2, months: 6}); // 2 years and 6 months

            test.same(callable(env, duration, '%Y years and %M months'), '02 years and 06 months');

            test.end();
        });

        test.test('merge', function (test) {
            let filter = getFilter('merge');
            let callable = filter.getCallable();

            test.throws(function () {
                callable(null, []);
            }, new Error('The merge filter only works with arrays or "Traversable", got "null" as first argument.'));

            test.throws(function () {
                callable([], null);
            }, new Error('The merge filter only works with arrays or "Traversable", got "null" as second argument.'));

            test.throws(function () {
                callable(undefined, []);
            }, new Error('The merge filter only works with arrays or "Traversable", got "undefined" as first argument.'));

            test.throws(function () {
                callable([], undefined);
            }, new Error('The merge filter only works with arrays or "Traversable", got "undefined" as second argument.'));

            test.throws(function () {
                callable('a', []);
            }, new Error('The merge filter only works with arrays or "Traversable", got "string" as first argument.'));

            test.throws(function () {
                callable([], 'a');
            }, new Error('The merge filter only works with arrays or "Traversable", got "string" as second argument.'));

            test.same(callable(['a'], ['b']), ['a', 'b']);
            test.same(callable(new Map([[0, 'a']]), ['b']), new Map([[0, 'a'], [1, 'b']]));

            test.end();
        });

        test.end();
    });

    test.test('twingGetAttribute', function (test) {
        let env = new TwingTestMockEnvironment(new TwingTestMockLoader(), {
            strict_variables: true
        });

        let source = new TwingSource('', '');

        test.test('should support method calls', function (test) {
            let foo = new Foo();

            // object property
            test.same(twingGetAttribute(env, new Foo(), 'oof', TwingTemplate.ANY_CALL, [], true), true);
            test.same(twingGetAttribute(env, new Foo(), 'oof', TwingTemplate.ANY_CALL, [], false), 'oof');

            test.same(twingGetAttribute(env, foo, 'foo'), 'foo', 'should resolve methods by their name');
            test.same(twingGetAttribute(env, foo, 'bar'), 'getBar', 'should resolve get{name} if {name} doesn\'t exist');
            test.same(twingGetAttribute(env, foo, 'Oof'), 'isOof', 'should resolve is{name} if {name} and get{name} don\'t exist');
            test.same(twingGetAttribute(env, foo, 'fooBar'), 'hasFooBar', 'should resolve has{name} if {name}, get{name} and is{name} don\'t exist');

            test.same(twingGetAttribute(env, foo, 'getfoo'), 'getFoo', 'should resolve method in a case-insensitive way');
            test.same(twingGetAttribute(env, foo, 'GeTfOo'), 'getFoo', 'should resolve method in a case-insensitive way');

            // !METHOD_CALL + boolean item
            test.same(twingGetAttribute(env, [2, 3], false), 2);
            test.same(twingGetAttribute(env, [2, 3], true), 3);

            // !METHOD_CALL + float item
            test.same(twingGetAttribute(env, [2, 3], 0.1), 2);
            test.same(twingGetAttribute(env, [2, 3], 1.1), 3);

            test.throws(function () {
                twingGetAttribute(env, [], 0);
            }, new TwingErrorRuntime('Index "0" is out of bounds as the array is empty.', -1, source));

            test.throws(function () {
                twingGetAttribute(env, [1], 1);
            }, new TwingErrorRuntime('Index "1" is out of bounds for array [1].', -1, source));

            test.throws(function () {
                twingGetAttribute(env, new Map(), 'foo');
            }, new TwingErrorRuntime('Impossible to access a key ("foo") on a object variable ("[object Map]").', -1, source));

            test.throws(function () {
                twingGetAttribute(env, null, 'foo', [], TwingTemplate.ARRAY_CALL);
            }, new TwingErrorRuntime('Impossible to access a key ("foo") on a null variable.', -1, source));

            test.throws(function () {
                twingGetAttribute(env, 5, 'foo', [], TwingTemplate.ARRAY_CALL);
            }, new TwingErrorRuntime('Impossible to access a key ("foo") on a number variable ("5").', -1, source));

            test.throws(function () {
                twingGetAttribute(env, null, 'foo', [], TwingTemplate.ANY_CALL);
            }, new TwingErrorRuntime('Impossible to access an attribute ("foo") on a null variable.', -1, source));

            // METHOD_CALL
            test.equals(twingGetAttribute(env, 5, 'foo', [], TwingTemplate.METHOD_CALL, true), false);
            test.equals(twingGetAttribute(env, 5, 'foo', [], TwingTemplate.METHOD_CALL, false, true), undefined);

            test.throws(function () {
                twingGetAttribute(env, null, 'foo', [], TwingTemplate.METHOD_CALL);
            }, new TwingErrorRuntime('Impossible to invoke a method ("foo") on a null variable.', -1, source));

            test.throws(function () {
                twingGetAttribute(env, 5, 'foo', [], TwingTemplate.METHOD_CALL);
            }, new TwingErrorRuntime('Impossible to invoke a method ("foo") on a number variable ("5").', -1, source));

            test.throws(function () {
                twingGetAttribute(env, [], 'foo', [], TwingTemplate.METHOD_CALL);
            }, new TwingErrorRuntime('Impossible to invoke a method ("foo") on an array.', -1, source));

            test.throws(function () {
                twingGetAttribute(env, new TwingTestExtensionCoreTemplate(env), 'foo');
            }, new TwingErrorRuntime('Accessing TwingTemplate attributes is forbidden.', -1));

            test.throws(function () {
                twingGetAttribute(env, new Foo(), 'ooof', TwingTemplate.ANY_CALL, [], false, false);
            }, new TwingErrorRuntime('Neither the property "ooof" nor one of the methods ooof()" or "getooof()"/"isooof()"/"hasooof()" exist and have public access in class "Foo".', -1, source));

            // no strict_variables
            env = new TwingTestMockEnvironment(new TwingTestMockLoader(), {
                strict_variables: false
            });

            test.same(twingGetAttribute(env, new Foo(), 'oof', TwingTemplate.ANY_CALL, [], false), 'oof');

            test.end();
        });

        test.end();
    });

    test.test('randomFunction', function (test) {
        let randomFunctionTestData = [
            [ // array
                ['apple', 'orange', 'citrus'],
                ['apple', 'orange', 'citrus']
            ],
            [ // Traversable
                new Set(['apple', 'orange', 'citrus']),
                ['apple', 'orange', 'citrus']
            ],
            [ // unicode string
                'Ä€é',
                ['Ä', '€', 'é']
            ],
            [ // numeric but string
                '123',
                ['1', '2', '3']
            ],
            [ // integer
                5,
                range(0, 5, 1)
            ],
            [ // float
                5.9,
                range(0, 5, 1)
            ],
            [ // negative
                -2,
                [0, -1, -2]
            ],
            [ // min max int
                50,
                range(50, 100),
                100,
            ],
            [ // min max float
                -9.5,
                range(-10, 10),
                9.5,
            ],
            [ // min null
                null,
                range(0, 100),
                100,
            ],
        ];

        let env = new TwingTestMockEnvironment(new TwingTestMockLoader());
        let random = env.getFunction('random');

        for (let data of randomFunctionTestData) {
            for (let i = 0; i < 100; i++) {
                let max = data.length > 2 ? data[2] : null;

                test.true(data[1].includes(random.getCallable()(env, data[0], max)));
            }
        }

        test.same(random.getAcceptedArgments(), [
            {name: 'values', defaultValue: null},
            {name: 'max', defaultValue: null}
        ]);

        test.end();
    });

    test.test('randomFunctionWithoutParameter', function (test) {
        let max = getrandmax();

        for (let i = 0; i < 100; i++) {
            let val = twingRandom(new TwingTestMockEnvironment(new TwingTestMockLoader()));
            test.true((typeof val === 'number') && val >= 0 && val <= max);
        }

        test.end();
    });

    test.test('randomFunctionReturnsAsIs', function (test) {
        test.same(twingRandom(new TwingTestMockEnvironment(new TwingTestMockLoader()), ''), '');
        test.same(twingRandom(new TwingTestMockEnvironment(new TwingTestMockLoader(), {
            charset: 'null'
        }), ''), '');
        let instance = {};
        test.same(twingRandom(new TwingTestMockEnvironment(new TwingTestMockLoader()), instance), instance);

        test.end();
    });

    test.test('randomFunctionOfEmptyArrayThrowsException', function (test) {
        test.throws(function () {
            twingRandom(new TwingTestMockEnvironment(new TwingTestMockLoader()), []);
        }, new TwingErrorRuntime('The random function cannot pick from an empty array.'));

        test.end();
    });

    test.test('randomFunctionOnNonUTF8String', function (test) {
        let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());
        twing.setCharset('ISO-8859-1');

        let text = iconv('UTF-8', 'ISO-8859-1', Buffer.from('Äé'));

        for (let i = 0; i < 30; i++) {
            let rand = twingRandom(twing, text);
            test.true(['Ä', 'é'].includes(iconv('ISO-8859-1', 'UTF-8', rand).toString()));
        }

        test.end();
    });

    test.test('reverseFilterOnNonUTF8String', function (test) {
        let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());
        twing.setCharset('ISO-8859-1');

        test.same(twingReverseFilter(twing, 'Äé'), 'éÄ');

        test.end();
    });

    test.test('reverseFilterOnUTF8String', function (test) {
        let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());

        test.same(twingReverseFilter(twing, 'évènement'), 'tnemenèvé');

        test.end();
    });

    test.test('customEscaper', function (test) {
        let customEscaperCases = [
            ['fooUTF-8', 'foo', 'foo'],
            ['UTF-8', null, 'foo'],
            ['42UTF-8', 42, 'foo'],
        ];

        for (let customEscaperCase of customEscaperCases) {
            let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());

            twing.getExtension('TwingExtensionCore').setEscaper('foo', foo_escaper_for_test);

            test.same(twingEscapeFilter(twing, customEscaperCase[1], customEscaperCase[2]), customEscaperCase[0]);
        }

        test.end();
    });

    test.test('customUnknownEscaper', function (test) {
        test.throws(function () {
            twingEscapeFilter(new TwingTestMockEnvironment(new TwingTestMockLoader()), 'foo', 'bar');
        }, new TwingErrorRuntime('Invalid escaping strategy "bar" (valid ones: html, js, url, css, html_attr).'));

        test.end();
    });

    test.test('twingFirst', function (test) {
        let i = new Map([
            [1, 'a'],
            [2, 'b'],
            [3, 'c']
        ]);

        let twingFirstCases = [
            ['a', 'abc'],
            [1, [1, 2, 3]],
            ['', null],
            ['', ''],
            ['a', new CoreTestIterator(i, [...i.keys()], true, 3)]
        ];

        for (let twingFirstCase of twingFirstCases) {
            let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());

            test.same(twingFirst(twing, twingFirstCase[1]), twingFirstCase[0]);
        }

        test.end();
    });

    test.test('twingLast', function (test) {
        let i = new Map([
            [1, 'a'],
            [2, 'b'],
            [3, 'c']
        ]);

        let twingLastCases = [
            ['c', 'abc'],
            [3, [1, 2, 3]],
            ['', null],
            ['', ''],
            ['c', new CoreTestIterator(i, [...i.keys()], true, 3)]
        ];

        for (let twingLastCase of twingLastCases) {
            let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());

            test.same(twingLast(twing, twingLastCase[1]), twingLastCase[0]);
        }

        test.end();
    });

    test.test('arrayKeysFilter', function (test) {
        let map = new Map([
            [1, 'a'],
            [2, 'b'],
            [3, 'c']
        ]);

        let keys = [...map.keys()];

        let arrayKeyCases = [
            [keys, map],
            [[0, 1, 2], new CoreTestIterator(map, keys)],
            [[], null]
        ];

        for (let arrayKeyCase of arrayKeyCases) {
            test.same(twingGetArrayKeysFilter(arrayKeyCase[1]), arrayKeyCase[0]);
        }

        test.end();
    });

    test.test('inFilter', function (test) {
        let map = new Map([
            [0, 1],
            [1, 2],
            ['a', 3],
            [2, 5],
            [3, 6],
            [4, 7]
        ]);

        let keys = [...map.keys()];

        let inFilterCases = [
            [true, 1, map],
            [true, '3', map],
            [true, '3', 'abc3def'],
            [true, 1, new CoreTestIterator(map, keys, true, 1)],
            [true, '3', new CoreTestIterator(map, keys, true, 3)],
            [false, 4, map],
            [false, 4, new CoreTestIterator(map, keys, true)],
            [false, 1, 1],
            [true, 'fo', new TwingMarkup('foo', 'utf-8')]
        ];

        for (let inFilterCase of inFilterCases) {
            test.same(twingInFilter(inFilterCase[1], inFilterCase[2]), inFilterCase[0]);
        }

        test.end();
    });

    test.test('sliceFilter', function (test) {
        let i = new Map([
            ['a', 1],
            ['b', 2],
            ['c', 3],
            ['d', 4],
        ]);

        let keys = [...i.keys()];

        let sliceFilterCases = [
            [new Map([['a', 1]]), i, 0, 1, true],
            [new Map([['a', 1]]), i, 0, 1, false],
            [new Map([['b', 2], ['c', 3]]), i, 1, 2],
            [new Map([[0, 1]]), [1, 2, 3, 4], 0, 1],
            [new Map([[0, 2], [1, 3]]), [1, 2, 3, 4], 1, 2],
            [new Map([[0, 2], [1, 3]]), new CoreTestIterator(i, keys, true), 1, 2],
            [i, i, 0, keys.length + 10, true],
            [new Map(), i, keys.length + 10],
            ['de', 'abcdef', 3, 2]
        ];

        for (let sliceFilterCase of sliceFilterCases) {
            let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());

            let actual = twingSlice(twing, sliceFilterCase[1], sliceFilterCase[2], sliceFilterCase[3], sliceFilterCase[4]);

            test.same(actual, sliceFilterCase[0]);
        }

        test.end();
    });

    test.test('dateFormat', function (test) {
        let extension = new TwingExtensionCore();

        extension.setDateFormat();

        test.same(extension.getDateFormat(), ['F j, Y H:i', '%d days']);

        test.end();
    });

    test.test('timezone', function (test) {
        let extension = new TwingExtensionCore();

        extension.setTimezone('UTC+1');

        test.same(extension.getTimezone(), 'UTC+1');

        test.end();
    });

    test.test('tests', function (test) {
        test.test('none', function (test) {
            let twingTest = getTest('none');
            let callable = twingTest.getCallable();

            test.same(callable(null), true);

            test.end();
        });

        test.end();
    });

    test.test('functions', function (test) {
        const env = new TwingEnvironment(new TwingLoaderNull(), {});

        /**
         * @param test
         * @param name
         * @param {TwingFunction} f
         * @param fixture
         */
        const testAcceptedArguments = (test, name, f, fixture) => {
            if (!fixture) {
                test.fail(`${name} function has no registered fixture`);
            } else {
                test.same(f.getAcceptedArgments(), fixture.arguments, `${name} function accepted arguments are as expected`);
            }
        };

        let fixtures = [
            {
                name: 'constant',
                arguments: [
                    {name: 'name'},
                    {name: 'object', defaultValue: null}
                ]
            },
            {
                name: 'cycle', arguments: [
                    {name: 'values'},
                    {name: 'position'}
                ]
            },
            {
                name: 'date', arguments: [
                    {name: 'date'},
                    {name: 'timezone'}
                ]
            },
            {
                name: 'dump', arguments: []
            },
            {
                name: 'include', arguments: [
                    {name: 'template'},
                    {name: 'variables', defaultValue: {}},
                    {name: 'with_context', defaultValue: true},
                    {name: 'ignore_missing', defaultValue: false},
                    {name: 'sandboxed', defaultValue: false}
                ]
            },
            {
                name: 'max', arguments: []
            },
            {
                name: 'min', arguments: []
            },
            {
                name: 'random', arguments: [
                    {name: 'values', defaultValue: null},
                    {name: 'max', defaultValue: null}
                ]
            },
            {
                name: 'range', arguments: [
                    {name: 'low'},
                    {name: 'high'},
                    {name: 'step'}
                ]
            },
            {
                name: 'source', arguments: [
                    {name: 'name'},
                    {name: 'ignore_missing', defaultValue: false}
                ]
            },
            {
                name: 'template_from_string', arguments: [
                    {name: 'template'},
                    {name: 'name', defaultValue: null}
                ]
            }
        ];

        for (let [name, f] of env.getFunctions()) {
            let fixture = fixtures.find((fixture) => {
                return fixture.name === name;
            });

            testAcceptedArguments(test, name, f, fixture);
        }

        test.end();
    });

    test.test('filters', function (test) {
        const env = new TwingEnvironment(new TwingLoaderNull(), {});

        /**
         * @param test
         * @param name
         * @param {TwingFilter} f
         * @param fixture
         */
        const testAcceptedArguments = (test, name, f, fixture) => {
            if (!fixture) {
                test.fail(`${name} filter has no registered fixture`);
            } else {
                test.same(f.getAcceptedArgments(), fixture.arguments, `${name} filter accepted arguments are as expected`);
            }
        };

        let fixtures = [
            {
                name: 'abs',
                arguments: []
            },
            {
                name: 'batch',
                arguments: [
                    {name: 'size'},
                    {name: 'fill', defaultValue: null},
                    {name: 'preserve_keys', defaultValue: true}
                ]
            },
            {
                name: 'capitalize',
                arguments: []
            },
            {
                name: 'column',
                arguments: [
                    {name: 'name'}
                ]
            },
            {
                name: 'convert_encoding',
                arguments: [
                    {name: 'to'},
                    {name: 'from'}
                ]
            },
            {
                name: 'date',
                arguments: [
                    {name: 'format', defaultValue: null},
                    {name: 'timezone', defaultValue: null}
                ]
            },
            {
                name: 'date_modify',
                arguments: [
                    {name: 'modifier'}
                ]
            },
            {
                name: 'default',
                arguments: [
                    {name: 'default'}
                ]
            },
            {
                name: 'e',
                arguments: [
                    {name: 'strategy'},
                    {name: 'charset'}
                ]
            },
            {
                name: 'escape',
                arguments: [
                    {name: 'strategy'},
                    {name: 'charset'}
                ]
            },
            {
                name: 'filter',
                arguments: [
                    {name: 'array'},
                    {name: 'arrow'}
                ]
            },
            {
                name: 'first',
                arguments: []
            },
            {
                name: 'format',
                arguments: []
            },
            {
                name: 'join',
                arguments: [
                    {name: 'glue', defaultValue: ''},
                    {name: 'and', defaultValue: null}
                ]
            },
            {
                name: 'json_encode',
                arguments: [
                    {name: 'options', defaultValue: null}
                ]
            },
            {
                name: 'keys',
                arguments: []
            },
            {
                name: 'last',
                arguments: []
            },
            {
                name: 'length',
                arguments: []
            },
            {
                name: 'lower',
                arguments: []
            },
            {
                name: 'map',
                arguments: [
                    {name: 'arrow'}
                ]
            },
            {
                name: 'merge',
                arguments: []
            },
            {
                name: 'nl2br',
                arguments: []
            },
            {
                name: 'number_format',
                arguments: [
                    {name: 'decimal'},
                    {name: 'decimal_point'},
                    {name: 'thousand_sep'}
                ]
            },
            {
                name: 'raw',
                arguments: []
            },
            {
                name: 'reduce',
                arguments: [
                    {name: 'arrow'},
                    {name: 'initial', defaultValue: null}
                ]
            },
            {
                name: 'replace',
                arguments: [
                    {name: 'from'}
                ]
            },
            {
                name: 'reverse',
                arguments: [
                    {name: 'preserve_keys', defaultValue: false}
                ]
            },
            {
                name: 'round',
                arguments: [
                    {name: 'precision', defaultValue: 0},
                    {name: 'method', defaultValue: 'common'}
                ]
            },
            {
                name: 'slice',
                arguments: [
                    {name: 'start'},
                    {name: 'length', defaultValue: null},
                    {name: 'preserve_keys', defaultValue: false}
                ]
            },
            {
                name: 'sort',
                arguments: []
            },
            {
                name: 'spaceless',
                arguments: []
            },
            {
                name: 'split',
                arguments: [
                    {name: 'delimiter'},
                    {name: 'limit'}
                ]
            },
            {
                name: 'striptags',
                arguments: [
                    {name: 'allowable_tags'}
                ]
            },
            {
                name: 'title',
                arguments: []
            },
            {
                name: 'trim',
                arguments: [
                    {name: 'character_mask', defaultValue: null},
                    {name: 'side', defaultValue: 'both'}
                ]
            },
            {
                name: 'upper',
                arguments: []
            },
            {
                name: 'url_encode',
                arguments: []
            },
        ];

        for (let [name, filter] of env.getFilters()) {
            let fixture = fixtures.find((fixture) => {
                return fixture.name === name;
            });

            testAcceptedArguments(test, name, filter, fixture);
        }

        test.test('twingSortFilter', function (test) {
            test.throws(function () {
                twingSortFilter(5);
            }, new TwingErrorRuntime('The sort filter only works with iterables, got "number".'));

            test.end();
        });

        test.test('twingTrimFilter', function (test) {
            test.throws(function () {
                twingTrimFilter('foo', '0', 'bar');
            }, new TwingErrorRuntime('Trimming side must be "left", "right" or "both".'));

            test.end();
        });

        test.test('twingReplaceFilter', function (test) {
            test.same(twingReplaceFilter('foo', null), 'foo');

            test.end();
        });

        test.test('twingRound', function (test) {
            test.throws(function () {
                twingRound(5, 0, 'foo');
            }, new TwingErrorRuntime('The round filter only supports the "common", "ceil", and "floor" methods.'));

            test.end();
        });

        test.test('twingUrlencodeFilter', function (test) {
            test.same(twingUrlencodeFilter(5), '');

            test.end();
        });

        test.test('twingJoinFilter', function (test) {
            test.same(twingJoinFilter(5, ''), '');
            test.same(twingJoinFilter([true, false], ''), '1');

            test.end();
        });

        test.test('twingDefaultFilter', function (test) {
            test.same(twingDefaultFilter(null), '');

            test.end();
        });

        test.test('twingInFilter', function (test) {
            test.same(twingInFilter(5, {foo: 1, bar: 5}), true);

            test.end();
        });

        test.test('twingEscapeFilter', function (test) {
            let env = new TwingEnvironment(new TwingLoaderArray({}));

            test.same(twingEscapeFilter(env, 'foo', 'html', 'UTF-8'), 'foo');
            test.same(twingEscapeFilter(env, 'foo', 'html', 'UTF-8'), 'foo');

            test.end();
        });

        // test.test('twingEscapeFilterIsSafe', function (test) {
        //     test.same(twingEscapeFilterIsSafe(new TwingNode(new Map([
        //         [0, new TwingNodeExpressionArray(new Map([
        //             [0, new TwingNodeExpressionConstant('foo', 1)]
        //         ]), 1)]
        //     ]))), []);
        //
        //     test.end();
        // });

        test.test('twingLengthFilter', function (test) {
            let env = new TwingEnvironment(new TwingLoaderArray({}));

            test.same(twingLengthFilter(env, 5), 1);
            test.same(twingLengthFilter(env, 55), 2);
            test.same(twingLengthFilter(env, new Map([[1, 1]])), 1);

            test.end();
        });

        test.test('twingLowerFilter', function (test) {
            let env = new TwingEnvironment(new TwingLoaderArray({}));

            test.same(twingLowerFilter(env, 'A'), 'a');
            test.same(twingLowerFilter(env, '5'), '5');

            test.end();
        });

        test.test('twingColumnFilter', function (test) {
            try {
                twingColumnFilter('foo', 'bar');

                test.fail('Should throw an error');
            } catch (e) {
                test.same(e.getMessage(), 'The column filter only works with arrays or "Traversable", got "string" as first argument.');
            }

            test.end();
        });

        test.end();
    });

    test.end();
});
