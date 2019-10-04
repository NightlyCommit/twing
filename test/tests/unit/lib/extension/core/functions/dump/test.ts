import * as tape from 'tape';
import {dump} from "../../../../../../../../src/lib/extension/core/functions/dump";

tape('dump', (test) => {
    test.same(dump({}, null), `NULL
`);
    test.same(dump({}, undefined), `NULL
`);
    test.same(dump({}, true), `bool(true)
`);
    test.same(dump({}, false), `bool(false)
`);
    test.same(dump({}, 8), `int(8)
`);
    test.same(dump({}, 8.8), `float(8.8)
`);
    test.same(dump({}, 'foo'), `string(3) "foo"
`);
    test.same(dump({}, () => {
    }), `object(Closure) (0) {}
`);
    test.same(dump({}, ['foo']), `array(1) {
    [0] =>
    string(3) "foo"
}
`);
    test.same(dump({}, new Map([[0, 'foo']])), `array(1) {
    [0] =>
    string(3) "foo"
}
`);
    test.same(dump({}, 'foo', 'bar'), `string(3) "foo"
string(3) "bar"
`);

    test.same(dump({}, [undefined]), `array(1) {
    [0] =>
    NULL
}
`);

    test.same(dump({}, [{foo: 'bar'}]), `array(1) {
    [0] =>
    array(1) {
            [foo] =>
            string(3) "bar"
    }
}
`);

    test.same(dump({}, new Date(0, 0, 0, 0, 0, 0, 0)), `array(0) {
}
`);

    test.end();
});