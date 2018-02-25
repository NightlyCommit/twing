import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";

class TestClassForMagicCallAttributes {
    getBar() {
        return 'bar_from_getbar';
    }

    __call(method: string, arguments_: Array<any>) {
        if (method === 'foo') {
            return 'foo_from_call';
        }

        return false;
    }
}

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'Twing supports __call() for attributes';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getData() {
        return {
            foo: new TestClassForMagicCallAttributes()
        }
    }

    getExpected() {
        return require('./expected.html');
    }
};