const tap = require('tape');
const MockEnvironement = require('../../../../mock/environment');
const MockLoader = require('../../../../mock/loader');

class OperatorExtension {
    constructor(operators) {
        this.operators = operators;
    }

    getTokenParsers() {
        return [];
    }

    getNodeVisitors() {
        return [];
    }

    getFilters() {
        return [];
    }

    getTests() {
        return [];
    }

    getFunctions() {
        return [];
    }

    getOperators() {
        return this.operators;
    }
}

let invalidExtensions = [
    [new OperatorExtension({}), '"OperatorExtension.getOperators()" must return an array with operators, got "Object".'],
    [new OperatorExtension([1, 2, 3]), '"OperatorExtension.getOperators()" must return an array of 2 elements, got 3.'],
    [new OperatorExtension('foo'), '"OperatorExtension.getOperators()" must return an array with operators, got "string".']
];

tap.test('custom-extension', function (test) {
    test.test('getInvalidOperators', function (test) {
        for (let invalidExtension of invalidExtensions) {
            let extension = invalidExtension[0];
            let expected = invalidExtension[1];

            let env = new MockEnvironement(new MockLoader);
            env.addExtension(extension);

            test.throws(function() {
                env.getUnaryOperators();
            }, new Error(expected));
        }

        test.end();
    });

    test.end();
});