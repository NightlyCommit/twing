import * as tape from 'tape';
import {createRange} from "../../../../../../../../src/lib/helpers/create-range";
import {MockEnvironment} from "../../../../../../../mock/environment";
import {MockLoader} from "../../../../../../../mock/loader";
import {random} from "../../../../../../../../src/lib/extension/core/functions/random";
import {iconv} from "../../../../../../../../src/lib/helpers/iconv";

const getrandmax = require('locutus/php/math/getrandmax');

tape('random', async (test) => {
    let randomFunctionTestData: [any, Map<any, any>, number][] = [
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

    let env = new MockEnvironment(new MockLoader());

    for (let data of randomFunctionTestData) {
        for (let i = 0; i < 100; i++) {
            let max = data[2];
            let values = [...data[1].values()];
            let randomValue = await random(env, data[0], max);

            test.true(values.includes(randomValue), `${randomValue} is among ${values}`);
        }
    }

    test.test('without parameter', async (test) => {
        let max = getrandmax();

        for (let i = 0; i < 100; i++) {
            let val = await random(new MockEnvironment(new MockLoader()));

            test.true((typeof val === 'number') && val >= 0 && val <= max);
        }

        test.end();
    });

    test.test('randomFunctionReturnsAsIs', async (test) => {
        test.same(await random(new MockEnvironment(new MockLoader()), ''), '');
        test.same(await random(new MockEnvironment(new MockLoader(), {
            charset: 'null'
        }), ''), '');

        let instance = {};

        test.same(await random(new MockEnvironment(new MockLoader()), instance), instance);

        test.end();
    });

    test.test('randomFunctionOfEmptyArrayThrowsException', async (test) => {
        try {
            await random(new MockEnvironment(new MockLoader()), []);

            test.fail();
        } catch (e) {
            test.same(e.message, 'The random function cannot pick from an empty array.');
        }

        test.end();
    });

    test.test('randomFunctionOnNonUTF8String', async (test) => {
        let twing = new MockEnvironment(new MockLoader());

        twing.setCharset('ISO-8859-1');

        let text = iconv('UTF-8', 'ISO-8859-1', Buffer.from('Äé'));

        for (let i = 0; i < 30; i++) {
            let rand = await random(twing, text);
            test.true(['Ä', 'é'].includes(iconv('ISO-8859-1', 'UTF-8', rand).toString()));
        }

        test.end();
    });

    test.end();
});
