import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" tag';
    }

    getTemplates() {
        return {
            'foo.twig': `
FOOBAR`,
            'index.twig': `
FOO
{% include "foo.twig" %}

BAR`
        };
    }

    getExpected() {
        return `
FOO

FOOBAR
BAR`;
    }

}
