const Runtime = require('../../../lib/runtime');

const tap = require('tap');

tap.test('Twing runtime', function (test) {
    let expected = ['clone',
        'compare',
        'count',
        'each',
        'echo',
        'flush',
        'isCountable',
        'isMap',
        'isPlainObject',
        'iteratorToMap',
        'merge',
        'obEndClean',
        'obGetClean',
        'obGetContents',
        'obStart',
        'range',
        'regexParser',
        'twingArrayMerge',
        'twingConstant',
        'twingEnsureTraversable',
        'TwingErrorLoader',
        'TwingErrorRuntime',
        'twingGetAttribute',
        'twingInFilter',
        'TwingMarkup',
        'TwingProfilerProfile',
        'TwingSandboxSecurityError',
        'TwingSandboxSecurityNotAllowedFilterError',
        'TwingSandboxSecurityNotAllowedFunctionError',
        'TwingSandboxSecurityNotAllowedTagError',
        'TwingSource',
        'TwingTemplate'
    ];

    for (let key of expected) {
        test.true(Runtime[key], `${key} is exported`);
    }

    for (let key in Runtime) {
        test.true(expected.includes(key), `${key} is legit`);
    }

    test.end();
});