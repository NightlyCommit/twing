const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'array index test';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getData() {
        return {
            days: new Map([
                [1, {money: 9}],
                [2, {money: 21}],
                [3, {money: 38}],
                [4, {money: 6}],
                [18, {money: 96}],
                [19, {money: 3}],
                [31, {money: 11}],
            ])
        }
    }
};
