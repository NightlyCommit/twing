import TestBase from "../../../TestBase";

export default class extends TestBase {
    getName() {
        return 'tags/include/only';
    }

    getTemplates() {
        return {
            'foo.twig': `
{% for k, v in _context %}{{ k }},{% endfor %}`,
            'index.twig': `
{% include "foo.twig" only %}
`
        };
    }

    getContext() {
        return {
            foo: 'bar'
        };
    }

    getExpected() {
        return `
global,_parent,`;
    }

}
