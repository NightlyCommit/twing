import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" function accepts Twig_Template instance';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ include(foo) }} FOO`,
            'foo.twig': `
BAR`
        };
    }

    getExpected() {
        return `
BAR FOO
`;
    }

    getContext() {
        return {
            foo: this.env.loadTemplate('foo.twig')
        }
    }
}
