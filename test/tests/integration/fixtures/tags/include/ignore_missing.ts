import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" tag with ignore_missing';
    }

    getTemplates() {
        return {
            'index.twig': `
{% include ["foo.twig", "bar.twig"] ignore missing %}
{% include "foo.twig" ignore missing %}
{% include "foo.twig" ignore missing with {} %}
{% include "foo.twig" ignore missing with {} only %}`
        };
    }

    getExpected() {
        return `
`;
    }

}
