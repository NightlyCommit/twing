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

    getContext() {
        return {
            foo: this.env.loadTemplate('foo.twig')
        };
    }

    getExpected() {
        return `BAR FOO
`;
    }

}
