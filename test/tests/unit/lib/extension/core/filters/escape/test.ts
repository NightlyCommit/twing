import * as tape from 'tape';
import {MockEnvironment} from "../../../../../../../mock/environment";
import {MockLoader} from "../../../../../../../mock/loader";
import {escape} from "../../../../../../../../src/lib/extension/core/filters/escape";
import {TwingEnvironment} from "../../../../../../../../src/lib/environment";

function foo_escaper_for_test(env: TwingEnvironment, string: string, charset: string) {
    return (string ? string : '') + charset;
}

/**
 * All character encodings supported by htmlspecialchars().
 */
let htmlSpecialChars: { [k: string]: string } = {
    '\'': '&#039;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
};

let htmlAttrSpecialChars: { [k: string]: string } = {
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

let jsSpecialChars: { [k: string]: string } = {
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

let urlSpecialChars: { [k: string]: string } = {
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

let cssSpecialChars: { [k: string]: string } = {
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
 * @param {number} codepoint Unicode codepoint in hex notation
 *
 * @return string UTF-8 literal string
 */
let codepointToUtf8 = function (codepoint: number) {
    if (codepoint < 0x110000) {
        return String.fromCharCode(codepoint);
    }

    throw new Error('Codepoint requested outside of Unicode range.');
};

let getEnvironment = function () {
    return new MockEnvironment(new MockLoader());
};

tape('escaping', (test) => {
    test.test('htmlEscapingConvertsSpecialChars', async (test) => {
        for (let key in htmlSpecialChars) {
            let value = htmlSpecialChars[key];

            test.same(await escape(getEnvironment(), key, 'html'), value, 'Succeed at escaping: ' + key);
        }

        test.end();
    });

    test.test('htmlAttributeEscapingConvertsSpecialChars', async (test) => {
        for (let key in htmlAttrSpecialChars) {
            let value = htmlAttrSpecialChars[key];

            test.same(await escape(getEnvironment(), key, 'html_attr'), value, 'Succeed at escaping: ' + key);
        }

        test.end();
    });

    test.test('javascriptEscapingConvertsSpecialChars', async (test) => {
        for (let key in jsSpecialChars) {
            let value = jsSpecialChars[key];

            test.same(await escape(getEnvironment(), key, 'js'), value, 'Succeed at escaping: ' + key);
        }

        test.end();
    });

    test.test('javascriptEscapingReturnsStringIfZeroLength', async (test) => {
        test.same(await escape(getEnvironment(), '', 'js'), '', 'Succeed at escaping: ""');

        test.end();
    });

    test.test('javascriptEscapingReturnsStringIfContainsOnlyDigits', async (test) => {
        test.same(await escape(getEnvironment(), '123', 'js'), '123', 'Succeed at escaping: "123"');

        test.end();
    });

    test.test('cssEscapingConvertsSpecialChars', async (test) => {
        for (let key in cssSpecialChars) {
            let value = cssSpecialChars[key];

            test.same(await escape(getEnvironment(), key, 'css'), value, 'Succeed at escaping: ' + key);
        }

        test.end();
    });

    test.test('cssEscapingReturnsStringIfZeroLength', async (test) => {
        test.same(await escape(getEnvironment(), '', 'css'), '', 'Succeed at escaping: ""');

        test.end();
    });

    test.test('cssEscapingReturnsStringIfContainsOnlyDigits', async (test) => {
        test.same(await escape(getEnvironment(), '123', 'css'), '123', 'Succeed at escaping: "123"');

        test.end();
    });

    test.test('urlEscapingConvertsSpecialChars', async (test) => {
        for (let key in urlSpecialChars) {
            let value = urlSpecialChars[key];

            test.same(await escape(getEnvironment(), key, 'url'), value, 'Succeed at escaping: ' + key);
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
    test.test('unicodeCodepointConversionToUtf8', async (test) => {
        let expected = ' ~ޙ';
        let codepoints = [0x20, 0x7e, 0x799];
        let result = '';

        for (let value of codepoints) {
            result += codepointToUtf8(value);
        }

        test.same(result, expected);

        test.end();
    });

    test.test('javascriptEscapingEscapesOwaspRecommendedRanges', async (test) => {
        let immune = [',', '.', '_']; // Exceptions to escaping ranges

        for (let chr = 0; chr < 0xFF; ++chr) {
            if (chr >= 0x30 && chr <= 0x39
                || chr >= 0x41 && chr <= 0x5A
                || chr >= 0x61 && chr <= 0x7A) {
                let literal = codepointToUtf8(chr);

                test.same(await escape(getEnvironment(), literal, 'js'), literal);
            } else {
                let literal = codepointToUtf8(chr);

                if (immune.includes(literal)) {
                    test.same(await escape(getEnvironment(), literal, 'js'), literal);
                } else {
                    test.notSame(await escape(getEnvironment(), literal, 'js'), literal);
                }
            }
        }

        test.end();
    });

    test.test('htmlAttributeEscapingEscapesOwaspRecommendedRanges', async (test) => {
        let immune = [',', '.', '-', '_']; // Exceptions to escaping ranges

        for (let chr = 0; chr < 0xFF; ++chr) {
            if (chr >= 0x30 && chr <= 0x39
                || chr >= 0x41 && chr <= 0x5A
                || chr >= 0x61 && chr <= 0x7A) {
                let literal = codepointToUtf8(chr);

                test.same(await escape(getEnvironment(), literal, 'html_attr'), literal);
            } else {
                let literal = codepointToUtf8(chr);

                if (immune.includes(literal)) {
                    test.same(await escape(getEnvironment(), literal, 'html_attr'), literal);
                } else {
                    test.notSame(await escape(getEnvironment(), literal, 'html_attr'), literal);
                }
            }
        }

        test.end();
    });

    test.test('cssEscapingEscapesOwaspRecommendedRanges', async (test) => {
        for (let chr = 0; chr < 0xFF; ++chr) {
            if (chr >= 0x30 && chr <= 0x39
                || chr >= 0x41 && chr <= 0x5A
                || chr >= 0x61 && chr <= 0x7A) {
                let literal = codepointToUtf8(chr);

                test.same(await escape(getEnvironment(), literal, 'css'), literal);
            } else {
                let literal = codepointToUtf8(chr);

                test.notSame(await escape(getEnvironment(), literal, 'css'), literal);
            }
        }

        test.end();
    });

    test.test('customEscaper', async (test) => {
        let customEscaperCases: [string, string | number, string, string][] = [
            ['fooUTF-8', 'foo', 'foo', 'UTF-8'],
            ['UTF-8', null, 'foo', 'UTF-8'],
            ['42UTF-8', 42, 'foo', undefined],
        ];

        for (let customEscaperCase of customEscaperCases) {
            let twing = new MockEnvironment(new MockLoader());

            twing.getCoreExtension().setEscaper('foo', foo_escaper_for_test);

            test.same(await escape(twing, customEscaperCase[1], customEscaperCase[2], customEscaperCase[3]), customEscaperCase[0]);
        }

        test.end();
    });

    test.test('customUnknownEscaper', async (test) => {
        try {
            await escape(new MockEnvironment(new MockLoader()), 'foo', 'bar');

            test.fail();
        } catch (e) {
            test.same(e.message, 'Invalid escaping strategy "bar" (valid ones: html, js, url, css, html_attr).');
        }

        test.end();
    });

    test.end();
});
