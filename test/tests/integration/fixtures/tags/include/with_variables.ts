import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'foo.twig': `{{ foo }}
`,
            'index.twig': `{% include "foo.twig" with {'foo': 'bar'} %}
{% include "foo.twig" with vars %}
{% include "foo.twig" with vars_as_obj %}`
        };
    }

    getContext() {
        return {
            vars: new Map([['foo', 'bar']]),
            vars_as_obj: {
                foo: 'bar'
            }
        };
    }

    getExpected() {
        return `bar
bar
bar
`;
    }

}
