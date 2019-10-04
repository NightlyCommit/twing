import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Exception for syntax error in reused template';
    }

    getTemplates() {
        return {
            'index.twig': `
{% use 'foo.twig' %}`,
            'foo.twig': `
{% block bar %}
    {% do node.data = 5 %}
{% endblock %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unexpected token "operator" of value "=" ("end of statement block" expected) in "foo.twig" at line 3.';
    }
}
