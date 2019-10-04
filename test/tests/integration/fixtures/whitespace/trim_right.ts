import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Whitespace trimming on tags (right side).';
    }

    getTemplates() {
        return {
            'index.twig': `
**{% if true -%}

    \t    foo{% endif %}**

**{{ 'foo' -}}

**

**{# comment -#}

**

**{% verbatim -%}

foo{% endverbatim %}**
`
        };
    }

    getExpected() {
        return `
**foo**

**foo**

****

**foo**
`;
    }
}
