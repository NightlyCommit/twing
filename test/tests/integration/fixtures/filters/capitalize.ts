import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"capitalize" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "i like Twing."|capitalize }}
{{ undef|capitalize }}`
        };
    }

    getExpected() {
        return `
I like Twing.`;
    }

    getContext(): any {
        return {
            undef: undefined
        };
    }
}
