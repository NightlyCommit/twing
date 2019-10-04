import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing parses postfix expressions';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import _self as macros %}

{% macro foo() %}foo{% endmacro %}

{{ 'a' }}
{{ 'a'|upper }}
{{ ('a')|upper }}
{{ -1|upper }}
{{ macros.foo() }}
{{ (macros).foo() }}`
        };
    }

    getExpected() {
        return `
a
A
A
-1
foo
foo
`;
    }
}
