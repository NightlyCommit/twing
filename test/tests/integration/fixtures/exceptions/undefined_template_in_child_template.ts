import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Exception for an undefined template in a child template';
    }

    getTemplates() {
          return {
            'index.twig': `
{% extends 'base.twig' %}

{% block sidebar %}
    {{ include('include.twig') }}
{% endblock %}`,
            'base.twig': `
{% block sidebar %}
{% endblock %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorLoader: Template "include.twig" is not defined in "index.twig" at line 5.';
    }
}
