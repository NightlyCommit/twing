import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"equal" operator';
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
        let nullVar: any = null;
        let emptyArray: Array<any> = [];

        return {
            nullVar: nullVar,
            emptyArray: emptyArray
        };
    }
};