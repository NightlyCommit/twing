const TwingExtensionStaging = require('../../../../../lib/twing/extension/staging');
const TwingFilter = require('../../../../../lib/twing/filter').TwingFilter;
const TwingFunction = require('../../../../../lib/twing/function').TwingFunction;
const TwingTokenParserFilter = require('../../../../../lib/twing/token-parser/filter').TwingTokenParserFilter;

const tap = require('tap');

tap.test('extension/staging', function (test) {
    let extension = new TwingExtensionStaging.TwingExtensionStaging();

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