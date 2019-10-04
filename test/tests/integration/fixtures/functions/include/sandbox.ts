import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" tag sandboxed';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ include("foo.twig", sandboxed = true) }}`,
            'foo.twig': `


{{ foo|e }}
{{ foo|e }}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingSandboxSecurityNotAllowedFilterError: Filter "e" is not allowed in "foo.twig" at line 4.';
    }
}
