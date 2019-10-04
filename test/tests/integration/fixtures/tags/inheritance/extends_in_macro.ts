import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'inheritance: extends in macro';
    }

    getTemplates() {
        return {
            'index.twig': `
{% macro foo() %}
    {% extends "foo.twig" %}
{% endmacro %}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Cannot use "extend" in a macro in "index.twig" at line 3.';
    }
}
