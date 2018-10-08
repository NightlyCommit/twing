const {varDump, TwingOutputBuffering} = require('../../../../../../build');

const tap = require('tape');

let dumpedValue = (...val) => {
    TwingOutputBuffering.obStart();

    varDump(...val);

    return TwingOutputBuffering.obGetClean();
};

tap.test('varDump', function (test) {
    test.same(dumpedValue(null), `NULL
`);
    test.same(dumpedValue(undefined), `NULL
`);
    test.same(dumpedValue(true), `bool(true)
`);
    test.same(dumpedValue(false), `bool(false)
`);
    test.same(dumpedValue(8), `int(8)
`);
    test.same(dumpedValue(8.8), `float(8.8)
`);
    test.same(dumpedValue('foo'), `string(3) "foo"
`);
    test.same(dumpedValue(() => {}), `object(Closure) (0) {}
`);
    test.same(dumpedValue(['foo']), `array(1) {
    [0] =>
    string(3) "foo"
}
`);
    test.same(dumpedValue(new Map([[0, 'foo']])), `array(1) {
    [0] =>
    string(3) "foo"
}
`);
    test.same(dumpedValue('foo', 'bar'), `string(3) "foo"
string(3) "bar"
`);

    test.same(dumpedValue([undefined]), `array(1) {
    [0] =>
    NULL
}
`);

    test.end();
});