import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Line whitespace trimming on tags (right side).';
    }

    getTemplates() {
        return {
            'index.twig': `
**{% if true ~%}
foo{% endif %}**

**{{ 'foo' ~}}
foo
**

**{# comment ~#}
\tfoo
**

**{% verbatim ~%}
    foo{% endverbatim %}**
`
        };
    }

    getExpected() {
        return `
**
foo**

**foo
foo
**

**
\tfoo
**

**
    foo**
`;
    }
}
