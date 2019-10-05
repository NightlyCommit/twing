import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"import" tag with a template as string';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import template_from_string("{% macro test() %}ok{% endmacro %}") as m %}
{{ m.test() }}
`
        };
    }

    getExpected() {
        return `
ok
`;
    }

}
