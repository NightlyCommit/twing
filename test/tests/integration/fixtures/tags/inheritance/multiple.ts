import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'base.twig': `
{% block content %}base {% endblock %}`,
            'index.twig': `
{% extends "layout.twig" %}{% block content %}{{ parent() }}index {% endblock %}`,
            'layout.twig': `
{% extends "base.twig" %}{% block content %}{{ parent() }}layout {% endblock %}`
        };
    }

    getExpected() {
        return `
base layout index
`;
    }

}
