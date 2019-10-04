import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'foo.twig': `
FOOBAR`,
            'index.twig': `
FOO
{% include foo %}

BAR`
        };
    }

    getExpected() {
        return `
FOO

FOOBAR
BAR`;
    }


    getContext() {
        return {
            foo: 'foo.twig'
        }
    }
}
