import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"block" tag creates a new context scope';
    }

    getTemplates() {
        return {
            'index.twig': `
{% block foo %}
    {% set item = "bar" %}
{% endblock %}
{{ item }}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `item` does not exist in "index.twig" at line 5.';
    }
}
