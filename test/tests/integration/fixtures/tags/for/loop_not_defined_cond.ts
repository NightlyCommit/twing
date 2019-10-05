import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for i, item in items if loop.last > 0 %}
{% endfor %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: The "loop" variable cannot be used in a looping condition in "index.twig" at line 2.'
    }

    getContext() {
        return {
            items: [
                'a',
                'b'
            ]
        };
    }
}
