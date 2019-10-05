import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing does not allow to use two-word named operators as variable names';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ starts with }}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unexpected token "operator" of value "starts with" in "index.twig" at line 2.';
    }
}
