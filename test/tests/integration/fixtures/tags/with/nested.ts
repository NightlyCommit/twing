import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'nested "with" tags';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set foo, bar = 'foo', 'bar' %}
{% with {bar: 'BAZ'} %}
    {% with {foo: 'FOO'} %}
        {{ foo }}{{ bar }}
    {% endwith %}
{% endwith %}
{{ foo }}{{ bar }}`
        };
    }

    getExpected() {
        return `
FOOBAZ
    foobar
`;
    }

}
