import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"extends" tag with parent() called twice';
    }

    getTemplates() {
        return {
            'foo.twig': `
{% block content %}BAR{% endblock %}`,
            'index.twig': `
{% extends "foo.twig" %}

{% block content %}{{ parent() }}FOO{{ parent() }}{% endblock %}`
        };
    }

    getExpected() {
        return `
BARFOOBAR
`;
    }

}
