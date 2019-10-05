import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'conditional "block" tag with "extends" tag';
    }

    getTemplates() {
        return {
            'index.twig': `
{% extends "layout.twig" %}

{% if false %}
    {% block content %}FOO{% endblock %}
{% endif %}`,
            'layout.twig': `
{% block content %}{% endblock %}`
        };
    }

    getExpected() {
        return `
FOO
`;
    }


    getExpectedDeprecationMessages() {
        return [
            'Nesting a block definition under a non-capturing node in "index.twig" at line 5 is deprecated since Twig 2.5.0 and will become a syntax error in Twig 3.0.'
        ];
    }

    getContext() {
        return {};
    }
}
