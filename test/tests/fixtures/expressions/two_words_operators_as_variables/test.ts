import TwingTestIntegrationTestCase from "../../../../integration-test-case";
import TwingTestFoo from "../../../../foo";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'Twing does not allow to use two-word named operators as variable names';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unexpected token "operator" of value "starts with" in "index.twig" at line 2.';
    }
};