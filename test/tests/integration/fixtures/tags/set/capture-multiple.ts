import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"set" tag block multiple capture';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set foo %}
bar
{% endset %}
{% set bar %}
foo
{% endset %}

{{ foo }}
{{ bar }}
`
        };
    }

    getExpected() {
        return `
bar

foo
`;
    }

}
