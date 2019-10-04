import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Template can contain JS interpolation-like strings';
    }

    getTemplates() {
        return {
            'index.twig': `\${thisShouldBeHandledAsRawText}
{{ "\${thisShouldBeHandledAsRawText}" }}`
        };
    }

    getExpected() {
        return `\${thisShouldBeHandledAsRawText}
\${thisShouldBeHandledAsRawText}`;
    }
}
