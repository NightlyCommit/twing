import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"raw" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "<br/>"|raw }}`
        };
    }

    getExpected() {
        return `
<br/>`;
    }
}
