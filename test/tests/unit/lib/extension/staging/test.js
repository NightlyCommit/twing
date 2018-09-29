const {
    TwingExtensionStaging,
    TwingFilter,
    TwingFunction,
    TwingTokenParserFilter
} = require('../../../../../../build/index');

const tap = require('tape');

tap.test('extension/staging', function (test) {
    let extension = new TwingExtensionStaging();

    test.test('addFilter', function(test) {
        let filter = new TwingFilter('foo', () => {});

        extension.addFilter(filter);

        test.throws(function() {
            extension.addFilter(new TwingFilter('foo', () => {}));
        }, new Error('Filter "foo" is already registered.'));

        test.end();
    });

    test.test('addFunction', function(test) {
        let function_ = new TwingFunction('foo', () => {});

        extension.addFunction(function_);

        test.throws(function() {
            extension.addFunction(new TwingFunction('foo', () => {}));
        }, new Error('Function "foo" is already registered.'));

        test.end();
    });

    test.test('addTokenParser', function(test) {
        let parser = new TwingTokenParserFilter();

        extension.addTokenParser(parser);

        test.throws(function() {
            extension.addTokenParser(new TwingTokenParserFilter());
        }, new Error('Tag "filter" is already registered.'));

        test.end();
    });


    test.end();
});