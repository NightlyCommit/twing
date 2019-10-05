import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'foo.twig': `
foo`,
            'index.twig': `
{% include ["foo.twig", "bar.twig"] %}
{% include ["bar.twig", "foo.twig"] %}`
        };
    }

    getExpected() {
        return `
foo
foo
`;
    }

}
