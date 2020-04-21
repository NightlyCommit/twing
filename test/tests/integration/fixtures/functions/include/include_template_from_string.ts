import TestBase from "../../../TestBase";

export default class extends TestBase {
    getEnvironmentOptions(): any {
        return {
            cache: 'tmp/itfs'
        };
    }

    getDescription() {
        return '"template_from_string" function works in an "include"';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set embed = '{% embed "embed.twig" %}{% endembed %}' %}
{{ include(template_from_string(embed)) }}`,
            'embed.twig': `
Cool`
        };
    }

    getExpected() {
        return `
Cool
`;
    }
}
