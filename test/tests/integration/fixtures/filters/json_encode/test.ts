import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";
import {TwingMarkup} from "../../../../../../src/markup";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"json_encode" filter';
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
            foo: new TwingMarkup('foo', 'UTF-8')
        }
    }
};