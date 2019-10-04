import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'multiple *extends* tags';
    }

    getTemplates() {
        return {
            'index.twig': `
{% extends foo %}
{% extends bar %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Multiple extends tags are forbidden in "index.twig" at line 3.';
    }
}
