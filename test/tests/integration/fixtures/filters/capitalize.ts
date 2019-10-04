import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"capitalize" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "i like Twing."|capitalize }}`
        };
    }

    getExpected() {
        return `
I like Twing.`;
    }
}
