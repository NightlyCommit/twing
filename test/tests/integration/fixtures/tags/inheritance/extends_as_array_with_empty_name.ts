import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"extends" tag using an array with an empty name'
    }

    getTemplates() {
        return {
            'bar.twig': `
{% block content %}
    foo
{% endblock %}`,
            'index.twig': `
{% extends ["", "bar.twig"] %}`
        };
    }

    getExpected() {
        return `
foo
`;
    }

}
