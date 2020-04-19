import * as tape from 'tape';
import {isIn} from "../../../../../../src/lib/helpers/is-in";

tape('is-in', (test) => {
    test.true(isIn(1, [1, 2]));
    test.true(isIn(2, [1, 2]));
    test.true(isIn(1, {foo: 1, bar: 2}));
    test.true(isIn(2, {foo: 1, bar: 2}));

    test.end();
});
