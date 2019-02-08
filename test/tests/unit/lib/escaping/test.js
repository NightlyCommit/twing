const {twingEscapeFilter} = require("../../../../../build/lib/extension/core");
const EnvironmentMock = require("../../../../mock/environment");
const LoaderMock = require("../../../../mock/loader");

const tap = require('tape');

/**
 * All character encodings supported by htmlspecialchars().
 */
let htmlSpecialChars = {
    '\'': '&#039;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
};

let htmlAttrSpecialChars = {
    '\'': '&#x27;',
    /* Characters beyond ASCII value 255 to unicode escape */
    'Ā': '&#x0100;',
    '😀': '&#x1F600;',
    /* Immune chars excluded */
    ',': ',',
    '.': '.',
    '-': '-',
    '_': '_',
    /* Basic alnums excluded */
    'a': 'a',
    'A': 'A',
    'z': 'z',
    'Z': 'Z',
    '0': '0',
    '9': '9',
    /* Basic control characters and null */
    "\r": '&#x0D;',
    "\n": '&#x0A;',
    "\t": '&#x09;',
    "\0": '&#xFFFD;', // should use Unicode replacement char
    /* Encode chars as named entities where possible */
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    /* Encode spaces for quoteless attribute protection */
    ' ': '&#x20;',
};

let jsSpecialChars = {
    /* HTML special chars - escape without exception to hex */
    '<': '\\u003C',
    '>': '\\u003E',
    '\'': '\\u0027',
    '"': '\\u0022',
    '&': '\\u0026',
    '/': '\\/',
    /* Characters beyond ASCII value 255 to unicode escape */
    'Ā': '\\u0100',
    '😀': '\\uD83D\\uDE00',
    /* Immune chars excluded */
    ',': ',',
    '.': '.',
    '_': '_',
    /* Basic alnums excluded */
    'a': 'a',
    'A': 'A',
    'z': 'z',
    'Z': 'Z',
    '0': '0',
    '9': '9',
    /* Basic control characters and null */
    "\r": '\\r',
    "\n": '\\n',
    "\x08": '\\b',
    "\t": '\\t',
    "\x0C": '\\f',
    "\0": '\\u0000',
    /* Encode spaces for quoteless attribute protection */
    ' ': '\\u0020',
};

let urlSpecialChars = {
    /* HTML special chars - escape without exception to percent encoding */
    '<': '%3C',
    '>': '%3E',
    '\'': '%27',
    '"': '%22',
    '&': '%26',
    /* Characters beyond ASCII value 255 to hex sequence */
    'Ā': '%C4%80',
    /* Punctuation and unreserved check */
    ',': '%2C',
    '.': '.',
    '_': '_',
    '-': '-',
    ':': '%3A',
    ';': '%3B',
    '!': '%21',
    /* Basic alnums excluded */
    'a': 'a',
    'A': 'A',
    'z': 'z',
    'Z': 'Z',
    '0': '0',
    '9': '9',
    /* Basic control characters and null */
    "\r": '%0D',
    "\n": '%0A',
    "\t": '%09',
    "\0": '%00',
    /* PHP quirks from the past */
    ' ': '%20',
    '~': '~',
    '+': '%2B',
};

let cssSpecialChars = {
    /* HTML special chars - escape without exception to hex */
    '<': '\\3C ',
    '>': '\\3E ',
    '\'': '\\27 ',
    '"': '\\22 ',
    '&': '\\26 ',
    /* Characters beyond ASCII value 255 to unicode escape */
    'Ā': '\\100 ',
    /* Immune chars excluded */
    ',': '\\2C ',
    '.': '\\2E ',
    '_': '\\5F ',
    /* Basic alnums excluded */
    'a': 'a',
    'A': 'A',
    'z': 'z',
    'Z': 'Z',
    '0': '0',
    '9': '9',
    /* Basic control characters and null */
    "\r": '\\D ',
    "\n": '\\A ',
    "\t": '\\9 ',
    "\0": '\\0 ',
    /* Encode spaces for quoteless attribute protection */
    ' ': '\\20 ',
};

/**
 * Convert a Unicode Codepoint to a literal UTF-8 character.
 *
 * @param int $codepoint Unicode codepoint in hex notation
 *
 * @return string UTF-8 literal string
 */
let codepointToUtf8 = function (codepoint) {
    if (codepoint < 0x110000) {
        return String.fromCharCode(codepoint);
    }

    throw new Error('Codepoint requested outside of Unicode range.');
};

let getEnvironment = function () {
    return new EnvironmentMock(new LoaderMock());
};

tap.test('escaping', function (test) {
    test.test('htmlEscapingConvertsSpecialChars', function (test) {
        for (let key in htmlSpecialChars) {
            let value = htmlSpecialChars[key];

            test.same(twingEscapeFilter(getEnvironment(), key, 'html'), value, 'Succeed at escaping: ' + key);
        }

        test.end();
    });

    test.test('htmlAttributeEscapingConvertsSpecialChars', function (test) {
        for (let key in htmlAttrSpecialChars) {
            let value = htmlAttrSpecialChars[key];

            test.same(twingEscapeFilter(getEnvironment(), key, 'html_attr'), value, 'Succeed at escaping: ' + key);
        }

        test.end();
    });

    test.test('javascriptEscapingConvertsSpecialChars', function (test) {
        for (let key in jsSpecialChars) {
            let value = jsSpecialChars[key];

            test.same(twingEscapeFilter(getEnvironment(), key, 'js'), value, 'Succeed at escaping: ' + key);
        }

        test.end();
    });

    test.test('javascriptEscapingReturnsStringIfZeroLength', function (test) {
        test.same(twingEscapeFilter(getEnvironment(), '', 'js'), '', 'Succeed at escaping: ""');

        test.end();
    });

    test.test('javascriptEscapingReturnsStringIfContainsOnlyDigits', function (test) {
        test.same(twingEscapeFilter(getEnvironment(), '123', 'js'), '123', 'Succeed at escaping: "123"');

        test.end();
    });

    test.test('cssEscapingConvertsSpecialChars', function (test) {
        for (let key in cssSpecialChars) {
            let value = cssSpecialChars[key];

            test.same(twingEscapeFilter(getEnvironment(), key, 'css'), value, 'Succeed at escaping: ' + key);
        }

        test.end();
    });

    test.test('cssEscapingReturnsStringIfZeroLength', function (test) {
        test.same(twingEscapeFilter(getEnvironment(), '', 'css'), '', 'Succeed at escaping: ""');

        test.end();
    });

    test.test('cssEscapingReturnsStringIfContainsOnlyDigits', function (test) {
        test.same(twingEscapeFilter(getEnvironment(), '123', 'css'), '123', 'Succeed at escaping: "123"');

        test.end();
    });

    test.test('urlEscapingConvertsSpecialChars', function (test) {
        for (let key in urlSpecialChars) {
            let value = urlSpecialChars[key];

            test.same(twingEscapeFilter(getEnvironment(), key, 'url'), value, 'Succeed at escaping: ' + key);
        }

        test.end();
    });

    /**
     * Range tests to confirm escaped range of characters is within OWASP recommendation.
     */

    /**
     * Only testing the first few 2 ranges on this prot. function as that's all these
     * other range tests require.
     */
    test.test('unicodeCodepointConversionToUtf8', function (test) {
        let expected = ' ~ޙ';
        let codepoints = [0x20, 0x7e, 0x799];
        let result = '';

        for (let value of codepoints) {
            result += codepointToUtf8(value);
        }

        test.same(result, expected);

        test.end();
    });

    test.test('javascriptEscapingEscapesOwaspRecommendedRanges', function (test) {
        let immune = [',', '.', '_']; // Exceptions to escaping ranges

        for (let chr = 0; chr < 0xFF; ++chr) {
            if (chr >= 0x30 && chr <= 0x39
                || chr >= 0x41 && chr <= 0x5A
                || chr >= 0x61 && chr <= 0x7A) {
                let literal = codepointToUtf8(chr);

                test.same(twingEscapeFilter(getEnvironment(), literal, 'js'), literal);
            }
            else {
                let literal = codepointToUtf8(chr);

                if (immune.includes(literal)) {
                    test.same(twingEscapeFilter(getEnvironment(), literal, 'js'), literal);
                }
                else {
                    test.notSame(twingEscapeFilter(getEnvironment(), literal, 'js'), literal);
                }
            }
        }

        test.end();
    });

    test.test('htmlAttributeEscapingEscapesOwaspRecommendedRanges', function (test) {
        let immune = [',', '.', '-', '_']; // Exceptions to escaping ranges

        for (let chr = 0; chr < 0xFF; ++chr) {
            if (chr >= 0x30 && chr <= 0x39
                || chr >= 0x41 && chr <= 0x5A
                || chr >= 0x61 && chr <= 0x7A) {
                let literal = codepointToUtf8(chr);

                test.same(twingEscapeFilter(getEnvironment(), literal, 'html_attr'), literal);
            }
            else {
                let literal = codepointToUtf8(chr);

                if (immune.includes(literal)) {
                    test.same(twingEscapeFilter(getEnvironment(), literal, 'html_attr'), literal);
                }
                else {
                    test.notSame(twingEscapeFilter(getEnvironment(), literal, 'html_attr'), literal);
                }
            }
        }

        test.end();
    });

    test.test('cssEscapingEscapesOwaspRecommendedRanges', function (test) {
        for (let chr = 0; chr < 0xFF; ++chr) {
            if (chr >= 0x30 && chr <= 0x39
                || chr >= 0x41 && chr <= 0x5A
                || chr >= 0x61 && chr <= 0x7A) {
                let literal = codepointToUtf8(chr);

                test.same(twingEscapeFilter(getEnvironment(), literal, 'css'), literal);
            }
            else {
                let literal = codepointToUtf8(chr);

                test.notSame(twingEscapeFilter(getEnvironment(), literal, 'css'), literal);
            }
        }

        test.end();
    });

    test.end();
});
