import * as tape from 'tape';
import {isCountable} from "../../../../../../src/lib/helpers/is-countable";

tape('is-countable', (test) => {
    test.test('supports arrays', (test) => {
        test.equals(isCountable(new Map()), true);
        test.equals(isCountable([]), true);
        test.equals(isCountable({}), true);

        test.end();
    });

    test.end();
});