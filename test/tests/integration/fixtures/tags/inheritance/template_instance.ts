import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'foo.twig': `
{% block content %}BAR{% endblock %}`,
            'index.twig': `
{% extends foo %}

{% block content %}
    {{ parent() }}FOO
{% endblock %}`
        };
    }

    getExpected() {
        return `
BARFOO
`;
    }


    getContext() {
        return {
            foo: this.env.loadTemplate('foo.twig')
        }
    }
}
