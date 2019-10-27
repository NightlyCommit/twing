import * as tape from 'tape';
import {dump} from "../../../../../../../../src/lib/extension/core/functions/dump";

tape('dump', async (test) => {
    test.same(await dump({}, null), `NULL
`);
    test.same(await dump({}, undefined), `NULL
`);
    test.same(await dump({}, true), `bool(true)
`);
    test.same(await dump({}, false), `bool(false)
`);
    test.same(await dump({}, 8), `int(8)
`);
    test.same(await dump({}, 8.8), `float(8.8)
`);
    test.same(await dump({}, 'foo'), `string(3) "foo"
`);
    test.same(await dump({}, () => {
    }), `object(Closure) (0) {}
`);
    test.same(await dump({}, ['foo']), `array(1) {
    [0] =>
    string(3) "foo"
}
`);
    test.same(await dump({}, new Map([[0, 'foo']])), `array(1) {
    [0] =>
    string(3) "foo"
}
`);
    test.same(await dump({}, 'foo', 'bar'), `string(3) "foo"
string(3) "bar"
`);

    test.same(await dump({}, [undefined]), `array(1) {
    [0] =>
    NULL
}
`);

    test.same(await dump({}, [{foo: 'bar'}]), `array(1) {
    [0] =>
    array(1) {
            [foo] =>
            string(3) "bar"
    }
}
`);

    test.same(await dump({}, new Date(0, 0, 0, 0, 0, 0, 0)), `array(0) {
}
`);

    test.end();
});
