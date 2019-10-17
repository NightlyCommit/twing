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

    async getContext() {
        return {
            foo: await this.env.loadTemplate('foo.twig')
        }
    }
}
