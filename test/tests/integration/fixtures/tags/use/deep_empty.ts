import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"use" tag';
    }

    getTemplates() {
        return {
            'bar.twig': `
`,
            'foo.twig': `
{% use "bar.twig" %}`,
            'index.twig': `
{% use "foo.twig" %}`
        };
    }

    getExpected() {
        return `
`;
    }

}
