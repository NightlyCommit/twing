import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'foo.twig': `
BAR`,
            'index.twig': `
{% include foo %} FOO`
        };
    }

    async getContext() {
        return {
            foo: await this.env.loadTemplate('foo.twig')
        };
    }

    getExpected() {
        return `BAR FOO
`;
    }

}
