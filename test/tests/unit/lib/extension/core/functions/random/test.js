const {random} = require('../../../../../../../../build/lib/extension/core/functions/random');
const tape = require('tape');
const getrandmax = require('locutus/php/math/getrandmax');
const {iconv} = require('../../../../../../../../build/lib/helpers/iconv');
const {createRange} = require('../../../../../../../../build/lib/helpers/create-range');

const TwingTestMockEnvironment = require('../../../../../../../mock/environment');
const TwingTestMockLoader = require('../../../../../../../mock/loader');

const {
    TwingErrorRuntime,
} = require('../../../../../../../../build/main');

tape.test('random', function (test) {
    /**
     * @type {[any, Map<any, any>, number][]}
     */
    let randomFunctionTestData = [
        [ // array
            new Map([[0, 'apple'], [1, 'orange'], [2, 'citrus']]),
            new Map([[0, 'apple'], [1, 'orange'], [2, 'citrus']]),
            null
        ],
        [ // unicode string
            'Ä€é',
            new Map([[0, 'Ä'], [1, '€'], [2, 'é']]),
            null
        ],
        [ // numeric but string
            '123',
            new Map([[0, '1'], [1, '2'], [2, '3']]),
            null
        ],
        [ // integer
            5,
            createRange(0, 5, 1),
            null
        ],
        [ // float
            5.9,
            createRange(0, 5, 1),
            null
        ],
        [ // negative
            -2,
            new Map([[0, 0], [1, -1], [2, -2]]),
            null
        ],
        [ // min max int
            50,
            createRange(50, 100, 1),
            100
        ],
        [ // min max float
            -9.5,
            createRange(-10, 10, 1),
            9.5
        ],
        [ // min null
            null,
            createRange(0, 100, 1),
            100
        ],
    ];

    let env = new TwingTestMockEnvironment(new TwingTestMockLoader());

    for (let data of randomFunctionTestData) {
        for (let i = 0; i < 100; i++) {
            let max = data[2];
            let values = [...data[1].values()];
            let randomValue = random(env, data[0], max);

            test.true(values.includes(randomValue), `${randomValue} is among ${values}`);
        }
    }

    test.test('without parameter', function (test) {
        let max = getrandmax();

        for (let i = 0; i < 100; i++) {
            let val = random(new TwingTestMockEnvironment(new TwingTestMockLoader()));
            test.true((typeof val === 'number') && val >= 0 && val <= max);
        }

        test.end();
    });

    test.test('randomFunctionReturnsAsIs', function (test) {
        test.same(random(new TwingTestMockEnvironment(new TwingTestMockLoader()), ''), '');
        test.same(random(new TwingTestMockEnvironment(new TwingTestMockLoader(), {
            charset: 'null'
        }), ''), '');
        let instance = {};
        test.same(random(new TwingTestMockEnvironment(new TwingTestMockLoader()), instance), instance);

        test.end();
    });

    test.test('randomFunctionOfEmptyArrayThrowsException', function (test) {
        test.throws(function () {
            random(new TwingTestMockEnvironment(new TwingTestMockLoader()), []);
        }, new TwingErrorRuntime('The random function cannot pick from an empty array.'));

        test.end();
    });

    test.test('randomFunctionOnNonUTF8String', function (test) {
        let twing = new TwingTestMockEnvironment(new TwingTestMockLoader());
        twing.setCharset('ISO-8859-1');

        let text = iconv('UTF-8', 'ISO-8859-1', Buffer.from('Äé'));

        for (let i = 0; i < 30; i++) {
            let rand = random(twing, text);
            test.true(['Ä', 'é'].includes(iconv('ISO-8859-1', 'UTF-8', rand).toString()));
        }

        test.end();
    });

    test.end();
});