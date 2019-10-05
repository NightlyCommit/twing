import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'macro with varargs argument';
    }

    getTemplates() {
        return {
            'index.twig': `
{% macro test(varargs) %}
{% endmacro %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: The argument "varargs" in macro "test" cannot be defined because the variable "varargs" is reserved for arbitrary arguments in "index.twig" at line 2.';
    }
}
