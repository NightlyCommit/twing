import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'foo.twig': `
{% block content %}{% endblock %}
`,
            'index.twig': `
{% block title1 %}FOO{% endblock %}
{% block title2 foo|lower %}`
        };
    }

    getExpected() {
        return `
FOObar`;
    }


    getContext() {
        return {
            'foo': 'bar'
        };
    }
}
