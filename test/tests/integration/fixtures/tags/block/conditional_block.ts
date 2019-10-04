import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'conditional "block" tag';
    }

    getTemplates() {
        return {
            'index.twig': `
{% if false %}{% block foo %}FOO{% endblock %}{% endif %}
{% if true %}{% block bar %}BAR{% endblock %}{% endif %}`
        };
    }

    getExpected() {
        return `
BAR
`;
    }


    getContext() {
        return {};
    }
}
