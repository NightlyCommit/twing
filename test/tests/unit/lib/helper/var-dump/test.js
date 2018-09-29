const {varDump} = require('../../../../../../build');

const tap = require('tape');

tap.test('varDump', function (test) {
    test.same(varDump('foo'), 'string(3) "foo"');
    test.same(varDump(['foo']), `array(1) {
    [0] =>
    string(3) "foo"
}
`);
    test.same(varDump(new Map([[0, 'foo']])), `array(1) {
    [0] =>
    string(3) "foo"
}
`);

    test.end();
});