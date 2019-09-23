const {TwingEnvironment, varDump, TwingOutputBuffering, TwingTemplate} = require("../../../../../../build/main");

const tap = require('tape');

let dumpedValue = (val) => {
    TwingOutputBuffering.obStart();

    varDump(val);

    return TwingOutputBuffering.obGetClean();
};

let Template = class extends TwingTemplate {

};

tap.test('extension/debug', function (test) {
    test.test('twingVarDump', function (test) {
        let env = new TwingEnvironment(null, {debug: false});
        let context = {
            foo: 'bar',
            map: new Map([
                ['foo', 'bar']
            ]),
            tpl: new Template(env)
        };

        test.equals(twingVarDump(env, {}), null);

        env = new TwingEnvironment(null, {debug: true});

        test.equals(twingVarDump(env, context), dumpedValue({
            foo: 'bar',
            map: new Map([
                ['foo', 'bar']
            ])
        }), 'should print the whole context - minus template instances - when no vars is passed');

        test.end();
    });

    test.end();
});