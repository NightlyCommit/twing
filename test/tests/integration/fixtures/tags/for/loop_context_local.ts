import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag adds a loop variable to the context locally';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for item in items %}
{% endfor %}
{% if loop is not defined %}WORKS{% endif %}`
        };
    }

    getExpected() {
        return `
WORKS
`;
    }


    getContext() {
        return {
            items: [] as any[]
        };
    }
}
