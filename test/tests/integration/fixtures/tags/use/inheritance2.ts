import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"use" tag';
    }

    getTemplates() {
        return {
            'ancestor.twig': `
{% block container %}
    <div class="container">{{ block('sub_container') }}</div>
{% endblock %}

{% block sub_container %}
    <div class="sub_container">sub_container</div>
{% endblock %}`,
            'index.twig': `
{% use "ancestor.twig" %}
{% use "parent.twig" %}

{{ block('container') }}`,
            'parent.twig': `
{% block sub_container %}
    <div class="overridden_sub_container">overridden sub_container</div>
{% endblock %}`
        };
    }

    getExpected() {
        return `
<div class="container">    <div class="overridden_sub_container">overridden sub_container</div>
</div>
`;
    }

}
