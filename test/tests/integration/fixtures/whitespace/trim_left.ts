import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Whitespace trimming on tags (left side).';
    }

    getTemplates() {
        return {
            'index.twig': `
**{% if true %}
foo

    \t    {%- endif %}**

**

\t    {{- 'foo' }}**

**


{#- comment #}**

**{% verbatim %}
foo

    \t    {%- endverbatim %}**
`
        };
    }

    getExpected() {
        return `
**foo**

**foo**

****

**
foo**
`;
    }
}
