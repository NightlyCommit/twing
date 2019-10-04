import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'foo.twig': `
{% block content %}FOO{% endblock %}`,
            'index.twig': `
{% extends "foo.twig" %}`
        };
    }

    getExpected() {
        return `
FOO
`;
    }

}
