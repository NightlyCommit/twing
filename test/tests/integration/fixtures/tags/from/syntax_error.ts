import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"from" tag with syntax error';
    }

    getTemplates() {
        return {
            'index.twig': `
{% from 'forms.twig' %}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unexpected token "end of statement block" of value "%}\n" ("name" expected with value "import") in "index.twig" at line 2.';
    }
}
