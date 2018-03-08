const Runtime = require('../../../lib/runtime');

const tap = require('tap');
const path = require('path');

tap.test('Twing runtime', function (test) {
    let exports = {
        compare: './twing/helper/compare',
        echo: './twing/output-buffering',
        flush: './twing/output-buffering',
        getContextProxy: './twing/helper/get-context-proxy',
        isCountable: './twing/helper/is-countable',
        iteratorToMap: './twing/helper/iterator-to-map',
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
        TwingMap: './twing/map/',
        TwingMarkup: './twing/markup',
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

    test.end();
});