const {TwingExtensionCore} = require('../../../../../../build/lib/extension/core');
const {twingDateConverter} = require('../../../../../../build/lib/extension/core/filters/date');
const {iconv} = require('../../../../../../build/lib/helpers/iconv');
const {formatDateTime} = require('../../../../../../build/lib/helpers/format-date-time');

const {TwingSource} = require('../../../../../../build/lib/source');
const {TwingErrorRuntime} = require('../../../../../../build/lib/error/runtime');
const {TwingTest} = require('../../../../../../build/lib/test');
const {TwingNodeExpressionConstant} = require('../../../../../../build/lib/node/expression/constant');
const {TwingNodeExpressionArray} = require('../../../../../../build/lib/node/expression/array');
const {TwingNode} = require('../../../../../../build/lib/node');
const {TwingLoaderArray} = require('../../../../../../build/lib/loader/array');
const {TwingLoaderRelativeFilesystem} = require('../../../../../../build/lib/loader/relative-filesystem');
const {TwingEnvironment} = require('../../../../../../build/lib/environment');
const {TwingSandboxSecurityPolicy} = require('../../../../../../build/lib/sandbox/security-policy');
const {TwingErrorLoader} = require('../../../../../../build/lib/error/loader');
const {TwingTemplate} = require('../../../../../../build/lib/template');

const TwingTestMockEnvironment = require('../../../../../mock/environment');
const TwingTestMockLoader = require('../../../../../mock/loader');

const Luxon = require('luxon');

const tap = require('tape');
const range = require('locutus/php/array/range');
const getrandmax = require('locutus/php/math/getrandmax');
const sinon = require('sinon');
const path = require('path');

let getFilter = function (name) {
    let extension = new TwingExtensionCore();

    for (let filter of extension.getFilters()) {
        if (filter.getName() === name) {
            return filter;
        }
    }
};

/**
 * @param name
 * @returns {TwingFunction}
 */
let getFunction = function (name) {
    let extension = new TwingExtensionCore();

    for (let function_ of extension.getFunctions()) {
        if (function_.getName() === name) {
            return function_;
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

tap.test('TwingExtensionCore', function (test) {
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
            ]
        ];

        let env = new TwingTestMockEnvironment(new TwingTestMockLoader());
        let function_ = getFunction('random');
        let callable = function_.getCallable();

        for (let data of randomFunctionTestData) {
            for (let i = 0; i < 100; i++) {
                test.true(data[1].includes(callable(env, data[0])));
            }
        }

        test.end();
    });

    test.test('randomFunctionWithoutParameter', function (test) {
        let max = getrandmax();

        let function_ = getFunction('random');
        let callable = function_.getCallable();

        for (let i = 0; i < 100; i++) {
            let val = callable(new TwingTestMockEnvironment(new TwingTestMockLoader()));
            test.true((typeof val === 'number') && val >= 0 && val <= max);
        }

        test.end();
    });

    test.test('randomFunctionReturnsAsIs', function (test) {
        let function_ = getFunction('random');
        let callable = function_.getCallable();

        test.same(callable(new TwingTestMockEnvironment(new TwingTestMockLoader()), ''), '');
        test.same(callable(new TwingTestMockEnvironment(new TwingTestMockLoader(), {
            charset: 'null'
        }), ''), '');
        let instance = {};
        test.same(callable(new TwingTestMockEnvironment(new TwingTestMockLoader()), instance), instance);

        test.end();
    });

    test.test('randomFunctionOfEmptyArrayThrowsException', function (test) {
        let function_ = getFunction('random');
        let callable = function_.getCallable();

        test.throws(function () {
            callable(new TwingTestMockEnvironment(new TwingTestMockLoader()), []);
        }, new TwingErrorRuntime('The random function cannot pick from an empty array.'));

        test.end();
    });

    test.test('randomFunctionOnNonUTF8String', function (test) {
        let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());
        twing.setCharset('ISO-8859-1');

        let text = iconv('UTF-8', 'ISO-8859-1', Buffer.from('Äé'));

        let function_ = getFunction('random');
        let callable = function_.getCallable();

        for (let i = 0; i < 30; i++) {
            let rand = callable(twing, text);
            test.true(['Ä', 'é'].includes(iconv('ISO-8859-1', 'UTF-8', rand).toString()));
        }

        test.end();
    });

    test.test('reverseFilterOnNonUTF8String', function (test) {
        let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());
        twing.setCharset('ISO-8859-1');

        let filter = getFilter('reverse');
        let callable = filter.getCallable();

        test.same(callable(twing, 'Äé'), 'éÄ');

        test.end();
    });

    test.test('reverseFilterOnUTF8String', function (test) {
        let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());

        let filter = getFilter('reverse');
        let callable = filter.getCallable();

        test.same(callable(twing, 'évènement'), 'tnemenèvé');

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

            twing.getCoreExtension().setEscaper('foo', foo_escaper_for_test);

            let filter = getFilter('escape');
            let callable = filter.getCallable();

            test.same(callable(twing, customEscaperCase[1], customEscaperCase[2]), customEscaperCase[0]);
        }

        test.end();
    });

    test.test('customUnknownEscaper', function (test) {
        let filter = getFilter('escape');
        let callable = filter.getCallable();

        test.throws(function () {
            callable(new TwingTestMockEnvironment(new TwingTestMockLoader()), 'foo', 'bar');
        }, new TwingErrorRuntime('Invalid escaping strategy "bar" (valid ones: html, js, url, css, html_attr).'));

        test.end();
    });

    test.test('twingFilterFirst', function (test) {
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

        let filter = getFilter('first');
        let callable = filter.getCallable();

        for (let twingFirstCase of twingFirstCases) {
            let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());

            test.same(callable(twing, twingFirstCase[1]), twingFirstCase[0]);
        }

        test.end();
    });

    test.test('twingFilterLast', function (test) {
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

        let filter = getFilter('last');
        let callable = filter.getCallable();

        for (let twingLastCase of twingLastCases) {
            let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());

            test.same(callable(twing, twingLastCase[1]), twingLastCase[0]);
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

        let filter = getFilter('keys');
        let callable = filter.getCallable();

        for (let arrayKeyCase of arrayKeyCases) {
            test.same(callable(arrayKeyCase[1]), arrayKeyCase[0]);
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

        let filter = getFilter('slice');
        let callable = filter.getCallable();

        for (let sliceFilterCase of sliceFilterCases) {
            let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());

            let actual = callable(twing, sliceFilterCase[1], sliceFilterCase[2], sliceFilterCase[3], sliceFilterCase[4]);

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

    test.test('functions', function (test) {
        test.test('twingFunctionCycle', function(test) {
            let callable = getFunction('cycle').getCallable();

            test.same(callable('foo'), 'foo');

            test.end();
        });

        test.test('twingDateConverter', function(test) {
            let env = new TwingEnvironment(new TwingLoaderArray({}));

            let callable = getFunction('date').getCallable();

            test.true(callable(env, 'now') instanceof Luxon.DateTime);

            test.throws(function() {
                twingDateConverter(env, {});
            }, new TwingErrorRuntime('Failed to parse date "[object Object]".'));

            test.same(callable(env, '2010-01-28T15:00:00', false).valueOf(), 1264690800000);

            let dateTime = callable(env, '2010-01-28T15:00:00');

            test.same(dateTime.format('H'), formatDateTime(dateTime, 'H'));

            test.end();
        });

        test.test('twingFilterSort', function(test) {
            let callable = getFilter('sort').getCallable();

            test.throws(function() {
                callable(5);
            }, new TwingErrorRuntime('The sort filter only works with iterables, got "number".'));

            test.end();
        });

        test.test('twingTrimFilter', function(test) {
            let callable = getFilter('trim').getCallable();

            test.throws(function() {
                callable('foo', '0', 'bar');
            }, new TwingErrorRuntime('Trimming side must be "left", "right" or "both".'));

            test.end();
        });

        test.test('twingFilterReplace', function(test) {
            let callable = getFilter('replace').getCallable();

            test.same(callable('foo', null), 'foo');

            test.end();
        });

        test.test('twingRound', function(test) {
            let callable = getFilter('round').getCallable();

            test.throws(function() {
                callable(5, 0, 'foo');
            }, new TwingErrorRuntime('The round filter only supports the "common", "ceil", and "floor" methods.'));

            test.end();
        });

        test.test('twingFilterUrlEncode', function(test) {
            let callable = getFilter('url_encode').getCallable();

            test.same(callable(5), '');

            test.end();
        });

        test.test('twingFilterJoin', function(test) {
            let callable = getFilter('join').getCallable();

            test.same(callable(5, ''), '');
            test.same(callable([true, false], ''), '1');

            test.end();
        });

        test.test('twingFilterDefault', function(test) {
            let callable = getFilter('default').getCallable();

            test.same(callable(null), '');

            test.end();
        });

        test.test('twingEscapeFilter', function(test) {
            let env = new TwingEnvironment(new TwingLoaderArray({}));

            let callable = getFilter('escape').getCallable();

            test.same(callable(env, 'foo', 'html', 'UTF-8'), 'foo');
            test.same(callable(env, 'foo', 'html', 'UTF-8'), 'foo');

            test.end();
        });

        test.test('twingEscapeFilterIsSafe', function(test) {
            let extension = new TwingExtensionCore();

            test.same(extension.escapeFilterIsSafe(new TwingNode(new Map([
                [0, new TwingNodeExpressionArray(new Map([
                    [0, new TwingNodeExpressionConstant('foo', 1, 1)]
                ]), 1, 1)]
            ]))), []);

            test.end();
        });

        test.test('twingLengthFilter', function(test) {
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let callable = getFilter('length').getCallable();

            test.same(callable(env, 5), 1);
            test.same(callable(env, 55), 2);
            test.same(callable(env, new Map([[1, 1]])), 1);

            test.end();
        });

        test.test('twingFilterLower', function(test) {
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let callable = getFilter('lower').getCallable();

            test.same(callable(env, 5), 5);

            test.end();
        });

        test.test('twingFunctionInclude', function(test) {
            let callable = getFunction('include').getCallable();

            let env = new TwingEnvironment(new TwingLoaderArray({}), {
                sandbox_policy: new TwingSandboxSecurityPolicy()
            });

            test.throws(function() {
                callable(env, new Map(), null, 'foo', {}, true, false, true)
            }, new TwingErrorLoader('Template "foo" is not defined.'));

            env = new TwingEnvironment(new TwingLoaderArray({foo: 'bar'}), {
                sandbox_policy: new TwingSandboxSecurityPolicy()
            });

            test.same(callable(env, new Map(), null,'foo', {}, true, false, true), 'bar');

            test.test('supports being called with a source', function (test) {
                env = new TwingEnvironment(new TwingLoaderRelativeFilesystem());

                test.same(callable(env, new Map(), new TwingSource('code', 'name', path.resolve('test/tests/unit/extension/core/index.twig')), 'templates/foo.twig'), 'foo');

                test.end();
            });

            test.end();
        });

        test.test('twingSource', function(test) {
            let loader = new TwingLoaderArray({});
            let env = new TwingEnvironment(loader);
            let callable = getFunction('source').getCallable();

            test.throws(function() {
                callable(env, 'foo');
            }, new TwingErrorLoader('Template "foo" is not defined.'));

            test.equals(callable(env, false, 'foo', true), null);

            sinon.stub(loader, 'getSourceContext').throws(new Error('foo'));

            test.throws(function() {
                callable(env, 'foo');
            }, new Error('foo'));

            test.end();
        });

        test.test('twingFunctionDump', function (test) {
            let callable = getFunction('dump').getCallable();

            let Template = class extends TwingTemplate {

            };

            let env = new TwingEnvironment(null, {debug: false});
            let context = {
                foo: 'bar',
                map: new Map([
                    ['foo', 'bar']
                ]),
                tpl: new Template(env)
            };

            test.equals(callable(env, {}), null);

            env = new TwingEnvironment(null, {debug: true});

            test.equals(callable(env, context), `array(2) {
    [foo] =>
    string(3) "bar"
    [map] =>
    array(1) {
            [foo] =>
            string(3) "bar"
    }
}
`, 'should print the whole context - minus template instances - when no vars is passed');

            test.end();
        });

        test.end();
    });

    test.test('constructor', function (test) {
        let extension = new TwingExtensionCore();

        test.same(extension.getDefaultStrategy('foo'), 'html');

        test.end();
    });

    test.end();
});
