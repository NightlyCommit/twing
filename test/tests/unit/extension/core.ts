import {Test} from "tape";
import TwingExtensionCore from "../../../../src/extension/core";
import TwingFilter from "../../../../src/filter";
import TwingMap from "../../../../src/map";
const tap = require('tap');

let getFilter = function(name: string): TwingFilter {
    let extension = new TwingExtensionCore();

    return extension.getFilters().find(function(filter: TwingFilter) {
      return filter.getName() === name;
    });
};

tap.test('extension core', function(test: Test) {
    test.test('filter', function(test: Test) {
        test.test('merge', function(test: any) {
            let filter = getFilter('merge');
            let callable = filter.getCallable();

            test.throws(function() {
                callable(null, []);
            }, new Error('The merge filter only works with arrays or "Traversable", got "null" as first argument.'));

            test.throws(function() {
                callable([], null);
            }, new Error('The merge filter only works with arrays or "Traversable", got "null" as second argument.'));

            test.throws(function() {
                callable(undefined, []);
            }, new Error('The merge filter only works with arrays or "Traversable", got "undefined" as first argument.'));

            test.throws(function() {
                callable([], undefined);
            }, new Error('The merge filter only works with arrays or "Traversable", got "undefined" as second argument.'));

            test.throws(function() {
                callable('a', []);
            }, new Error('The merge filter only works with arrays or "Traversable", got "string" as first argument.'));

            test.throws(function() {
                callable([], 'a');
            }, new Error('The merge filter only works with arrays or "Traversable", got "string" as second argument.'));

            test.same(callable(['a'], ['b']), new TwingMap([[0, 'a'],[1, 'b']]));

            test.end();
        });

        test.end();
    });

    test.end();
});