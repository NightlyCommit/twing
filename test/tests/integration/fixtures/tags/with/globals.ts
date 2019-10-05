import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"with" tag include the globals';
    }

    getTemplates() {
        return {
            'index.twig': `
{% with [] only %}
    {{ global }}
{% endwith %}
`
        };
    }

    getExpected() {
        return `
global
`;
    }

}
