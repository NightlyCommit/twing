import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"extends" tag with conditional parent';
    }

    getTemplates() {
        return {
            'bar.twig': `
{% block content %}BAR{% endblock %}`,
            'foo.twig': `
{% block content %}FOO{% endblock %}`,
            'index.twig': `
{% extends standalone ? foo : 'bar.twig' %}

{% block content %}{{ parent() }}FOO{% endblock %}`
        };
    }

    getExpected() {
        return `
FOOFOO
`;
    }


    getContext() {
        return {
            foo: 'foo.twig',
            standalone: true
        }
    }
}
