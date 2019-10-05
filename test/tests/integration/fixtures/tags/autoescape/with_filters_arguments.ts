import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"autoescape" tag do not applies escaping on filter arguments';
    }

    getTemplates() {
        return {
            'index.twig': `
{% autoescape 'html' %}
{{ var|nl2br_("<br />") }}
{{ var|nl2br_("<br />"|escape) }}
{{ var|nl2br_(sep) }}
{{ var|nl2br_(sep|raw) }}
{{ var|nl2br_(sep|escape) }}
{% endautoescape %}`
        };
    }

    getExpected() {
        return `
&lt;Fabien&gt;<br />
Twig
&lt;Fabien&gt;&lt;br /&gt;
Twig
&lt;Fabien&gt;<br />
Twig
&lt;Fabien&gt;<br />
Twig
&lt;Fabien&gt;&lt;br /&gt;
Twig
`;
    }


    getContext() {
        return {
            var: `<Fabien>\nTwig`,
            sep: '<br />'
        };
    }
}
