import TestBase from "../../../TestBase";

export default class extends TestBase {
    getName() {
        return 'tags/spaceless/root_level_in_child.legacy';
    }

    getDescription() {
        return '"spaceless" tag in the root level of a child template';
    }

    getTemplates() {
        return {
            'index.twig': `
{% extends "layout.twig" %}
{% spaceless %}
    {% block content %}
        <h1>
            <b>Title</b>
        </h1>
    {% endblock %}
{% endspaceless %}`,
            'layout.twig': `
{% block content %}FOO{% endblock %}`
        };
    }

    getExpected() {
        return `
        <h1>
            <b>Title</b>
        </h1>
`;
    }


    getExpectedDeprecationMessages() {
        return [
            'The "spaceless" tag in "index.twig" at line 3 is deprecated since Twig 2.7, use the "spaceless" filter instead.',
            'Using the spaceless tag at the root level of a child template in "index.twig" at line 3 is deprecated since Twig 2.5.0 and will become a syntax error in Twig 3.0.',
            'Nesting a block definition under a non-capturing node in "index.twig" at line 4 is deprecated since Twig 2.5.0 and will become a syntax error in Twig 3.0.'
        ];
    }
}
