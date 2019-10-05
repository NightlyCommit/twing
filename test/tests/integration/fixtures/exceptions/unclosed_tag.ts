import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Exception for an unclosed tag';
    }

    getTemplates() {
        return {
            'index.twig': `
{% block foo %}
     {% if foo %}




         {% for i in fo %}



         {% endfor %}



{% endblock %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unexpected "endblock" tag (expecting closing tag for the "if" tag defined near line 4) in "index.twig" at line 16.';
    }
}
