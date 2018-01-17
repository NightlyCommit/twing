import {Test} from "tape";
import {isNumber} from "util";
import random from '../../../src/util/random';
import TwingEnvironment from "../../../src/environment";

const tap = require('tap');

let env = new TwingEnvironment(null, {});

tap.test('random', function (test: Test) {
    test.true(['a', 'b', 'c'].includes(random(env, 'abc')), 'returns a random character from a string');
    test.true(['a', 'b', 'c'].includes(random(env, ['a', 'b', 'c'])), 'returns a random item from a Traversable or array');

    let randomNumber = random(env, 10);

    test.true(isNumber(randomNumber) && 0 <= randomNumber && 10 >= randomNumber, 'returns a random integer between 0 and the integer parameter');

    test.end();
});