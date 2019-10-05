import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'base.twig': `
{% block content %}Default Content{% endblock %}

{% block footer %}Default Footer{% endblock %}`,
            'included.twig': `
{% extends "base.twig" %}
{% block content %}Included Content{% endblock %}`,
            'index.twig': `
{% extends "base.twig" %}
{% block content %}{% include "included.twig" %}{% endblock %}

{% block footer %}Footer{% endblock %}`
        };
    }

    getExpected() {
        return `
Included Content
Default Footer
Footer
`;
    }

}
