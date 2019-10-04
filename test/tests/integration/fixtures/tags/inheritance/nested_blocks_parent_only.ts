import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'foo.twig': `
`,
            'index.twig': `
{% block content %}
    CONTENT
    {%- block subcontent -%}
        SUBCONTENT
    {%- endblock -%}
    ENDCONTENT
{% endblock %}`
        };
    }

    getExpected() {
        return `
CONTENTSUBCONTENTENDCONTENT
`;
    }

}
