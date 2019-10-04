import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"verbatim" tag';
    }

    getTemplates() {
        return {
            'index.twig': `
1***

{%- verbatim %}
    {{ 'bla' }}
{% endverbatim %}

1***
2***

{%- verbatim -%}
    {{ 'bla' }}
{% endverbatim %}

2***
3***

{%- verbatim -%}
    {{ 'bla' }}
{% endverbatim -%}

3***
4***

{%- verbatim -%}
    {{ 'bla' }}
{%- endverbatim %}

4***
5***

{%- verbatim -%}
    {{ 'bla' }}
{%- endverbatim -%}

5***`
        };
    }

    getExpected() {
        return `
1***
    {{ 'bla' }}


1***
2***{{ 'bla' }}


2***
3***{{ 'bla' }}
3***
4***{{ 'bla' }}

4***
5***{{ 'bla' }}5***`;
    }

}
