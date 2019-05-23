const {twingFunctionDump} = require('../../../../../../build/core/functions/dump');
const {TwingEnvironmentNode} = require('../../../../../../build/environment/node');

const tap = require('tape');

let dumpedValue = (...val) => {
    let env = new TwingEnvironmentNode(null, {
        debug: true
    });

    return twingFunctionDump(env, ...val);
};

tap.test('dump', function (test) {
    test.same(dumpedValue({foo: null}), `array(1) {
    [foo] =>
    NULL
}
`);
    test.same(dumpedValue({foo: undefined}), `array(1) {
    [foo] =>
    NULL
}
`);
    test.same(dumpedValue({foo: true}), `array(1) {
    [foo] =>
    bool(true)
}
`);
    test.same(dumpedValue({foo: false}), `array(1) {
    [foo] =>
    bool(false)
}
`);
    test.same(dumpedValue({foo: 8}), `array(1) {
    [foo] =>
    int(8)
}
`);
    test.same(dumpedValue({foo: 8.8}), `array(1) {
    [foo] =>
    float(8.8)
}
`);
    test.same(dumpedValue({foo: 'foo'}), `array(1) {
    [foo] =>
    string(3) "foo"
}
`);
    test.same(dumpedValue({foo: () => {}}), `array(1) {
    [foo] =>
    object(Closure) (0) {}
}
`);
    test.same(dumpedValue({foo: ['foo']}), `array(1) {
    [foo] =>
    array(1) {
            [0] =>
            string(3) "foo"
    }
}
`);
    test.same(dumpedValue({foo: new Map([[0, 'foo']])}), `array(1) {
    [foo] =>
    array(1) {
            [0] =>
            string(3) "foo"
    }
}
`);
    test.same(dumpedValue('foo', 'bar'), `string(3) "bar"
`);

    test.same(dumpedValue([undefined]), `array(1) {
    [0] =>
    NULL
}
`);

    test.end();
});