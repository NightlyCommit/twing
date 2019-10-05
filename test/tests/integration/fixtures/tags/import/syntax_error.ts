import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"import" tag with syntax error';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import 'forms.twig' %}

{{ macros.parent() }}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unexpected token "end of statement block" of value "%}\n" ("name" expected with value "as") in "index.twig" at line 2.';
    }
}
