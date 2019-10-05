import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'foo.twig': `
{% block content %}BAR{% endblock %}`,
            'index.twig': `
{% use 'foo.twig' %}

{% block content %}
    {{ parent() }}
{% endblock %}`
        };
    }

    getExpected() {
        return `
BAR
`;
    }

}
