import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'foo.twig': `
{% block content %}
    {% block subcontent %}
        SUBCONTENT
    {% endblock %}
{% endblock %}`,
            'index.twig': `
{% extends "foo.twig" %}

{% block content %}
    {% block subcontent %}
        {% block subsubcontent %}
            SUBSUBCONTENT
        {% endblock %}
    {% endblock %}
{% endblock %}`
        };
    }

    getExpected() {
        return `
SUBSUBCONTENT
`;
    }

}
