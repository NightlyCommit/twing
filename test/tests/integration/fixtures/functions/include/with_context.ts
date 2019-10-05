import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" function accept variables and with_context';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ include("foo.twig") }}
{{- include("foo.twig", with_context = false) }}
{{- include("foo.twig", {'foo1': 'bar'}) }}
{{- include("foo.twig", {'foo1': 'bar'}, with_context = false) }}`,
            'foo.twig': `
{% for k, v in _context %}{{ k }},{% endfor %}`
        };
    }

    getExpected() {
        return `
foo,global,_parent,
global,_parent,
foo,global,foo1,_parent,
foo1,global,_parent,
`;
    }

    getContext() {
        return {
            foo: 'bar'
        }
    }
}
