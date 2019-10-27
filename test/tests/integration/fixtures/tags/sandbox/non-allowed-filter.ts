import TestBase from "../../../TestBase";
import {TwingEnvironmentOptions} from "../../../../../../src/lib/environment-options";

export default class extends TestBase {
    getDescription() {
        return '"sandbox" tag with non-allowed filter';
    }

    getTemplates() {
        return {
            'foo.twig': `{{ "foo"|upper }}`,
            'index.twig': `
{%- sandbox %}
    {%- include "foo.twig" %}
{%- endsandbox %}
`
        };
    }

    getEnvironmentOptions(): TwingEnvironmentOptions {
        return {
            autoescape: false
        }
    }

    getExpectedErrorMessage() {
        return 'TwingSandboxSecurityNotAllowedFilterError: Filter "upper" is not allowed in "foo.twig" at line 1.';
    }
}
