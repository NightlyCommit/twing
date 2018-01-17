import TwingTestIntegrationTestCase from "../../../../integration-test-case";
import TwingTestFoo from "../../../../foo";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"default" filter';
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

        return {
            definedVar: 'defined',
            zeroVar: 0,
            emptyVar: '',
            nullVar: nullVar,
            nested: {
                definedVar: 'defined',
                zeroVar: 0,
                emptyVar: '',
                nullVar: nullVar,
                definedArray: [0],
            },
            object: new TwingTestFoo(),
        }
    }

    getConfig() {
        return {
            strict_variables: false
        }
    }
};