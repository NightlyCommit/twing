import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"embed" tag';
    }

    getTemplates() {
        return {
            'foo.twig': `
{% block c1 %}{% endblock %}`,
            'index.twig': `
FOO
{% embed "foo.twig" %}
    {% block c1 %}
        {{ nothing }}
    {% endblock %}
{% endembed %}
BAR`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `nothing` does not exist in "index.twig" at line 5.'
    }
}
