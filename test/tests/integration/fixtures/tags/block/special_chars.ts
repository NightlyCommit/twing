import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"§" special chars in a block name';
    }

    getTemplates() {
        return {
            'index.twig': `
{% block § %}
§
{% endblock § %}`
        };
    }

    getExpected() {
        return `
§`;
    }

}
