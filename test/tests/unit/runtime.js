const Runtime = require('../../../lib/runtime');

const tap = require('tap');
const path = require('path');

tap.test('Twing runtime', function (test) {
    let exports = {
        clone: './twing/helper/clone',
        compare: './twing/helper/compare',
        count: './twing/helper/count',
        each: './twing/helper/each',
        echo: './twing/output-buffering',
        flush: './twing/output-buffering',
        isCountable: './twing/helper/is-countable',
        iteratorToMap: './twing/helper/iterator-to-map',
        merge: './twing/helper/merge',
        obEndClean: './twing/output-buffering',
        obGetClean: './twing/output-buffering',
        obGetContents: './twing/output-buffering',
        obStart: './twing/output-buffering',
        range: './twing/helper/range',
        regexParser: './twing/helper/regex-parser',
        twingArrayMerge: './twing/extension/core',
        twingConstant: './twing/extension/core',
        twingEnsureTraversable: './twing/extension/core',
        TwingErrorLoader: './twing/error/loader',
        TwingErrorRuntime: './twing/error/runtime',
        twingGetAttribute: './twing/extension/core',
        twingInFilter: './twing/extension/core',
        TwingMarkup: './twing/markup',
        TwingProfilerProfile: './twing/profiler/profile',
        TwingSandboxSecurityError: './twing/sandbox/security-error',
        TwingSandboxSecurityNotAllowedFilterError: './twing/sandbox/security-not-allowed-filter-error',
        TwingSandboxSecurityNotAllowedFunctionError: './twing/sandbox/security-not-allowed-function-error',
        TwingSandboxSecurityNotAllowedTagError: './twing/sandbox/security-not-allowed-tag-error',
        TwingSource: './twing/source',
        TwingTemplate: './twing/template'
    };

    for (let key in exports) {
        let fileName = exports[key];

        let exportedSymbol = require(path.resolve('lib', fileName))[key];

        test.same(exportedSymbol, Runtime[key], `${key} is exported`);
    }

    for (let key in Runtime) {
        test.true(exports[key], `${key} is legit`);
    }

    test.end();
});