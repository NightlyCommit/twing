const {TwingToken, TwingTokenType} = require('../../../../build/token');

const tap = require('tape');

tap.test('token', function (test) {
    test.test('should support type to string representation', function (test) {
        test.same(TwingToken.typeToString(TwingTokenType.BLOCK_END), 'TwingTokenType.BLOCK_END');
        test.same(TwingToken.typeToString(TwingTokenType.BLOCK_START), 'TwingTokenType.BLOCK_START');
        test.same(TwingToken.typeToString(TwingTokenType.EOF), 'TwingTokenType.EOF');
        test.same(TwingToken.typeToString(TwingTokenType.INTERPOLATION_END), 'TwingTokenType.INTERPOLATION_END');
        test.same(TwingToken.typeToString(TwingTokenType.INTERPOLATION_START), 'TwingTokenType.INTERPOLATION_START');
        test.same(TwingToken.typeToString(TwingTokenType.NAME), 'TwingTokenType.NAME');
        test.same(TwingToken.typeToString(TwingTokenType.NUMBER), 'TwingTokenType.NUMBER');
        test.same(TwingToken.typeToString(TwingTokenType.OPERATOR), 'TwingTokenType.OPERATOR');
        test.same(TwingToken.typeToString(TwingTokenType.PUNCTUATION), 'TwingTokenType.PUNCTUATION');
        test.same(TwingToken.typeToString(TwingTokenType.STRING), 'TwingTokenType.STRING');
        test.same(TwingToken.typeToString(TwingTokenType.TEXT), 'TwingTokenType.TEXT');
        test.same(TwingToken.typeToString(TwingTokenType.VAR_END), 'TwingTokenType.VAR_END');
        test.same(TwingToken.typeToString(TwingTokenType.VAR_START), 'TwingTokenType.VAR_START');
        test.same(TwingToken.typeToString(TwingTokenType.WHITESPACE), 'TwingTokenType.WHITESPACE');
        test.same(TwingToken.typeToString(TwingTokenType.CLOSING_QUOTE), 'TwingTokenType.CLOSING_QUOTE');
        test.same(TwingToken.typeToString(TwingTokenType.OPENING_QUOTE), 'TwingTokenType.OPENING_QUOTE');
        test.same(TwingToken.typeToString(TwingTokenType.WHITESPACE_CONTROL_MODIFIER_TRIMMING), 'TwingTokenType.WHITESPACE_CONTROL_MODIFIER_TRIMMING');
        test.same(TwingToken.typeToString(TwingTokenType.WHITESPACE_CONTROL_MODIFIER_LINE_TRIMMING), 'TwingTokenType.WHITESPACE_CONTROL_MODIFIER_LINE_TRIMMING');

        test.same(TwingToken.typeToString(TwingTokenType.BLOCK_END, true), 'BLOCK_END');
        test.same(TwingToken.typeToString(TwingTokenType.BLOCK_START, true), 'BLOCK_START');
        test.same(TwingToken.typeToString(TwingTokenType.EOF, true), 'EOF');
        test.same(TwingToken.typeToString(TwingTokenType.INTERPOLATION_END, true), 'INTERPOLATION_END');
        test.same(TwingToken.typeToString(TwingTokenType.INTERPOLATION_START, true), 'INTERPOLATION_START');
        test.same(TwingToken.typeToString(TwingTokenType.NAME, true), 'NAME');
        test.same(TwingToken.typeToString(TwingTokenType.NUMBER, true), 'NUMBER');
        test.same(TwingToken.typeToString(TwingTokenType.OPERATOR, true), 'OPERATOR');
        test.same(TwingToken.typeToString(TwingTokenType.PUNCTUATION, true), 'PUNCTUATION');
        test.same(TwingToken.typeToString(TwingTokenType.STRING, true), 'STRING');
        test.same(TwingToken.typeToString(TwingTokenType.TEXT, true), 'TEXT');
        test.same(TwingToken.typeToString(TwingTokenType.VAR_END, true), 'VAR_END');
        test.same(TwingToken.typeToString(TwingTokenType.VAR_START, true), 'VAR_START');
        test.same(TwingToken.typeToString(TwingTokenType.COMMENT_START, true), 'COMMENT_START');
        test.same(TwingToken.typeToString(TwingTokenType.COMMENT_END, true), 'COMMENT_END');
        test.same(TwingToken.typeToString(TwingTokenType.WHITESPACE, true), 'WHITESPACE');
        test.same(TwingToken.typeToString(TwingTokenType.CLOSING_QUOTE, true), 'CLOSING_QUOTE');
        test.same(TwingToken.typeToString(TwingTokenType.OPENING_QUOTE, true), 'OPENING_QUOTE');
        test.same(TwingToken.typeToString(TwingTokenType.WHITESPACE_CONTROL_MODIFIER_TRIMMING, true), 'WHITESPACE_CONTROL_MODIFIER_TRIMMING');
        test.same(TwingToken.typeToString(TwingTokenType.WHITESPACE_CONTROL_MODIFIER_LINE_TRIMMING, true), 'WHITESPACE_CONTROL_MODIFIER_LINE_TRIMMING');

        test.throws(function() {
            TwingToken.typeToString(-999);
        }, new Error('Token of type "-999" does not exist.'));

        test.end();
    });

    test.test('should support type to english representation', function (test) {
        test.same(TwingToken.typeToEnglish(TwingTokenType.BLOCK_END), 'end of statement block');
        test.same(TwingToken.typeToEnglish(TwingTokenType.BLOCK_START), 'begin of statement block');
        test.same(TwingToken.typeToEnglish(TwingTokenType.EOF), 'end of template');
        test.same(TwingToken.typeToEnglish(TwingTokenType.INTERPOLATION_END), 'end of string interpolation');
        test.same(TwingToken.typeToEnglish(TwingTokenType.INTERPOLATION_START), 'begin of string interpolation');
        test.same(TwingToken.typeToEnglish(TwingTokenType.NAME), 'name');
        test.same(TwingToken.typeToEnglish(TwingTokenType.NUMBER), 'number');
        test.same(TwingToken.typeToEnglish(TwingTokenType.OPERATOR), 'operator');
        test.same(TwingToken.typeToEnglish(TwingTokenType.PUNCTUATION), 'punctuation');
        test.same(TwingToken.typeToEnglish(TwingTokenType.STRING), 'string');
        test.same(TwingToken.typeToEnglish(TwingTokenType.TEXT), 'text');
        test.same(TwingToken.typeToEnglish(TwingTokenType.VAR_END), 'end of print statement');
        test.same(TwingToken.typeToEnglish(TwingTokenType.VAR_START), 'begin of print statement');
        test.same(TwingToken.typeToEnglish(TwingTokenType.COMMENT_START), 'begin of comment statement');
        test.same(TwingToken.typeToEnglish(TwingTokenType.COMMENT_END), 'end of comment statement');
        test.same(TwingToken.typeToEnglish(TwingTokenType.WHITESPACE), 'whitespace');
        test.same(TwingToken.typeToEnglish(TwingTokenType.CLOSING_QUOTE), 'closing quote');
        test.same(TwingToken.typeToEnglish(TwingTokenType.OPENING_QUOTE), 'opening quote');
        test.same(TwingToken.typeToEnglish(TwingTokenType.WHITESPACE_CONTROL_MODIFIER_TRIMMING), 'trimming whitespace control modifier');
        test.same(TwingToken.typeToEnglish(TwingTokenType.WHITESPACE_CONTROL_MODIFIER_LINE_TRIMMING), 'line trimming whitespace control modifier');

        test.throws(function() {
            TwingToken.typeToEnglish('999');
        }, new Error('Token of type "-999" does not exist.'));

        test.end();
    });

    test.test('serialize', function (test) {
        let token = new TwingToken(TwingTokenType.TEXT, '\nfoo\nbar\n', 1, 1);

        let expected = `
foo
bar
`;

        test.same(token.serialize(), expected);

        test.end();
    });

    test.end();
});