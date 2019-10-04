import TestBase from "../../TestBase";

export default class extends TestBase {
    getName() {
        return 'filters/replace_invalid_arg';
    }

    getDescription() {
        return 'Exception for invalid argument type in replace call';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 'test %foo%'|replace(stdClass) }}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: The "replace" filter expects an hash or "Iterable" as replace values, got "boolean" in "index.twig" at line 2.';
    }

    getContext() {
        return {
            stdClass: false
        }
    }
}
