import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'foo.twig': `
{% block content %}{% endblock %}`,
            'index.twig': `
{% extends foo %}

{% block content %}
    FOO
{% endblock %}`
        };
    }

    getExpected() {
        return `
FOO
`;
    }


    getContext() {
        return {
            foo: 'foo.twig'
        }
    }
}
