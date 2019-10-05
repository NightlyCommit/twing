import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"verbatim" tag';
    }

    getTemplates() {
        return {
            'index.twig': `
{% verbatim %}
{{ foo }}
{% endverbatim %}`
        };
    }

    getExpected() {
        return `
{{ foo }}`;
    }

}
