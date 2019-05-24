const {TwingToken} = require('../../../../build/token');

const tap = require('tape');

tap.test('token', function (test) {
    test.test('should support type to string representation', function (test) {
        test.same(TwingToken.typeToString(TwingToken.BLOCK_END_TYPE), 'TwingToken.BLOCK_END_TYPE');
        test.same(TwingToken.typeToString(TwingToken.BLOCK_START_TYPE), 'TwingToken.BLOCK_START_TYPE');
        test.same(TwingToken.typeToString(TwingToken.EOF_TYPE), 'TwingToken.EOF_TYPE');
        test.same(TwingToken.typeToString(TwingToken.INTERPOLATION_END_TYPE), 'TwingToken.INTERPOLATION_END_TYPE');
        test.same(TwingToken.typeToString(TwingToken.INTERPOLATION_START_TYPE), 'TwingToken.INTERPOLATION_START_TYPE');
        test.same(TwingToken.typeToString(TwingToken.NAME_TYPE), 'TwingToken.NAME_TYPE');
        test.same(TwingToken.typeToString(TwingToken.NUMBER_TYPE), 'TwingToken.NUMBER_TYPE');
        test.same(TwingToken.typeToString(TwingToken.OPERATOR_TYPE), 'TwingToken.OPERATOR_TYPE');
        test.same(TwingToken.typeToString(TwingToken.PUNCTUATION_TYPE), 'TwingToken.PUNCTUATION_TYPE');
        test.same(TwingToken.typeToString(TwingToken.STRING_TYPE), 'TwingToken.STRING_TYPE');
        test.same(TwingToken.typeToString(TwingToken.TEXT_TYPE), 'TwingToken.TEXT_TYPE');
        test.same(TwingToken.typeToString(TwingToken.VAR_END_TYPE), 'TwingToken.VAR_END_TYPE');
        test.same(TwingToken.typeToString(TwingToken.VAR_START_TYPE), 'TwingToken.VAR_START_TYPE');

        test.same(TwingToken.typeToString(TwingToken.BLOCK_END_TYPE, true), 'BLOCK_END_TYPE');
        test.same(TwingToken.typeToString(TwingToken.BLOCK_START_TYPE, true), 'BLOCK_START_TYPE');
        test.same(TwingToken.typeToString(TwingToken.EOF_TYPE, true), 'EOF_TYPE');
        test.same(TwingToken.typeToString(TwingToken.INTERPOLATION_END_TYPE, true), 'INTERPOLATION_END_TYPE');
        test.same(TwingToken.typeToString(TwingToken.INTERPOLATION_START_TYPE, true), 'INTERPOLATION_START_TYPE');
        test.same(TwingToken.typeToString(TwingToken.NAME_TYPE, true), 'NAME_TYPE');
        test.same(TwingToken.typeToString(TwingToken.NUMBER_TYPE, true), 'NUMBER_TYPE');
        test.same(TwingToken.typeToString(TwingToken.OPERATOR_TYPE, true), 'OPERATOR_TYPE');
        test.same(TwingToken.typeToString(TwingToken.PUNCTUATION_TYPE, true), 'PUNCTUATION_TYPE');
        test.same(TwingToken.typeToString(TwingToken.STRING_TYPE, true), 'STRING_TYPE');
        test.same(TwingToken.typeToString(TwingToken.TEXT_TYPE, true), 'TEXT_TYPE');
        test.same(TwingToken.typeToString(TwingToken.VAR_END_TYPE, true), 'VAR_END_TYPE');
        test.same(TwingToken.typeToString(TwingToken.VAR_START_TYPE, true), 'VAR_START_TYPE');
        test.same(TwingToken.typeToString(TwingToken.COMMENT_START_TYPE, true), 'COMMENT_START_TYPE');
        test.same(TwingToken.typeToString(TwingToken.COMMENT_END_TYPE, true), 'COMMENT_END_TYPE');

        test.throws(function() {
            TwingToken.typeToString(-999);
        }, new Error('Token of type "-999" does not exist.'));

        test.end();
    });

    test.test('should support type to english representation', function (test) {
        test.same(TwingToken.typeToEnglish(TwingToken.BLOCK_END_TYPE), 'end of statement block');
        test.same(TwingToken.typeToEnglish(TwingToken.BLOCK_START_TYPE), 'begin of statement block');
        test.same(TwingToken.typeToEnglish(TwingToken.EOF_TYPE), 'end of template');
        test.same(TwingToken.typeToEnglish(TwingToken.INTERPOLATION_END_TYPE), 'end of string interpolation');
        test.same(TwingToken.typeToEnglish(TwingToken.INTERPOLATION_START_TYPE), 'begin of string interpolation');
        test.same(TwingToken.typeToEnglish(TwingToken.NAME_TYPE), 'name');
        test.same(TwingToken.typeToEnglish(TwingToken.NUMBER_TYPE), 'number');
        test.same(TwingToken.typeToEnglish(TwingToken.OPERATOR_TYPE), 'operator');
        test.same(TwingToken.typeToEnglish(TwingToken.PUNCTUATION_TYPE), 'punctuation');
        test.same(TwingToken.typeToEnglish(TwingToken.STRING_TYPE), 'string');
        test.same(TwingToken.typeToEnglish(TwingToken.TEXT_TYPE), 'text');
        test.same(TwingToken.typeToEnglish(TwingToken.VAR_END_TYPE), 'end of print statement');
        test.same(TwingToken.typeToEnglish(TwingToken.VAR_START_TYPE), 'begin of print statement');
        test.same(TwingToken.typeToEnglish(TwingToken.COMMENT_START_TYPE), 'begin of comment statement');
        test.same(TwingToken.typeToEnglish(TwingToken.COMMENT_END_TYPE), 'end of comment statement');

        test.throws(function() {
            TwingToken.typeToEnglish(-999);
        }, new Error('Token of type "-999" does not exist.'));

        test.end();
    });

    test.end();
});