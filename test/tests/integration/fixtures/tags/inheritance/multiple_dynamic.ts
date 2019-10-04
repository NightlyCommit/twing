import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            '1_parent.twig': `
{% block content %}1{% endblock %}`,
            '2_parent.twig': `
{% block content %}2{% endblock %}`,
            'index.twig': `
{% set foo = 1 %}
{{ include('parent.twig') }}
{{ include('parent.twig') }}
{% set foo = 2 %}
{{ include('parent.twig') }}`,
            'parent.twig': `
{% extends foo~'_parent.twig' %}{% block content %}{{ parent() }} parent{% endblock %}`
        };
    }

    getExpected() {
        return `
1 parent

1 parent

2 parent
`;
    }

}
