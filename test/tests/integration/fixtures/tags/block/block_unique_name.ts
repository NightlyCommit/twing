import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'index.twig': `
{% block content %}
    {% block content %}
    {% endblock %}
{% endblock %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: The block \'content\' has already been defined line 2 in "index.twig" at line 3.';
    }
}
