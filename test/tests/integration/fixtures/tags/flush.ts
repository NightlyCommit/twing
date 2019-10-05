import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"flush" tag should flush the output buffer';
    }

    getTemplates() {
        return {
            'index.twig': `
FOO
BAR
{% set foo %}
    {% flush %}
{% endset %}
{{ foo }}`
        };
    }

    getExpected() {
        return `
FOO
BAR
`;
    }

}
