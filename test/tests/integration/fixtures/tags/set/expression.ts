import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"set" tag';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set foo, bar = 'foo' ~ 'bar', 'bar' ~ 'foo' %}

{{ foo }}
{{ bar }}`
        };
    }

    getExpected() {
        return `
foobar
barfoo
`;
    }

}
