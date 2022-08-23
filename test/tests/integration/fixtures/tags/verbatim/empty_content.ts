import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"verbatim" tag';
    }

    getTemplates() {
        return {
            'index.twig': `
1***

{% verbatim -%}
{%- endverbatim %}

1***
2***

{% verbatim %}{% endverbatim %}

2***`
        };
    }

    getExpected() {
        return `
1***



1***
2***



2***`;
    }

}
