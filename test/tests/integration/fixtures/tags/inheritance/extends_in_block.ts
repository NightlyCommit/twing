import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'inheritance: extends in block';
    }

    getTemplates() {
        return {
            'index.twig': `
{% block foo %}
    {% extends "foo.twig" %}
{% endblock %}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Cannot use "extend" in a block in "index.twig" at line 3.';
    }
}
