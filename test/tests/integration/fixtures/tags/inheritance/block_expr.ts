import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"extends" tag and parent function';
    }

    getTemplates() {
        return {
            'base.twig': `
{% spaceless %}
    {% block element -%}
        <div>
            {%- if item.children is defined %}
                {%- for item in item.children %}
                    {{- block('element') -}}
                {% endfor %}
            {%- endif -%}
        </div>
    {%- endblock %}
{% endspaceless %}`,
            'index.twig': `
{% extends "base.twig" %}

{% block element -%}
    Element:
    {{- parent() -}}
{% endblock %}`
        };
    }

    getExpected() {
        return `
Element:<div>Element:<div></div>Element:<div></div></div>
`;
    }


    getContext() {
        return {
            item: {
                children: [
                    null,
                    null
                ] as any[]
            }
        }
    }
}
