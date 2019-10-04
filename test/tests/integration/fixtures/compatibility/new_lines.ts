import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'all flavors of new lines are rendered as line feeds';
    }

    getTemplates() {
        return {
            'index.twig': '\r\rfoo\r\nbar\roof\n\r'
        };
    }

    getExpected() {
        return '\n\nfoo\nbar\noof\n\n';
    }
}
