import TestBase from "../../../TestBase";

export default class extends TestBase {
    getName() {
        return 'tags/include/missing_nested';
    }

    getTemplates() {
        return {
            'base.twig': `
{% block content %}
    {% include "foo.twig" %}
{% endblock %}`,
            'index.twig': `
{% extends "base.twig" %}

{% block content %}
    {{ parent() }}
{% endblock %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorLoader: Template "foo.twig" is not defined in "base.twig" at line 3.'
    }
}
