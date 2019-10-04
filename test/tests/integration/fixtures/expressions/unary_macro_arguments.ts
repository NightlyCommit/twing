import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing manages negative numbers as default parameters';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import _self as macros %}
{{ macros.negative_number1() }}
{{ macros.negative_number2() }}
{{ macros.negative_number3() }}
{{ macros.positive_number1() }}
{{ macros.positive_number2() }}
{% macro negative_number1(nb=-1) %}{{ nb }}{% endmacro %}
{% macro negative_number2(nb = --1) %}{{ nb }}{% endmacro %}
{% macro negative_number3(nb = - 1) %}{{ nb }}{% endmacro %}
{% macro positive_number1(nb = +1) %}{{ nb }}{% endmacro %}
{% macro positive_number2(nb = ++1) %}{{ nb }}{% endmacro %}`
        };
    }

    getExpected() {
        return `
-1
1
-1
1
1
`;
    }
}
