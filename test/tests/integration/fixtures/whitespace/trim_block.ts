import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Whitespace trimming on tags.';
    }

    getTemplates() {
        return {
            'index.twig': `
Trim on control tag:
{% for i in range(1, 9) -%}
\t{{ i }}
{%- endfor %}


Trim on output tag:
{% for i in range(1, 9) %}
\t{{- i -}}
{% endfor %}


Trim comments:

{#- Invisible -#}

After the comment.

Trim leading space:
{% if leading %}

\t\t{{- leading }}
{% endif %}

{%- if leading %}
\t{{- leading }}

{%- endif %}


Trim trailing space:
{% if trailing -%}
\t{{ trailing -}}

{% endif -%}

Combined:

{%- if both -%}
<ul>
\t<li>    {{- both -}}   </li>
</ul>

{%- endif -%}

end
`
        };
    }

    getExpected() {
        return `
Trim on control tag:
123456789

Trim on output tag:
123456789

Trim comments:After the comment.

Trim leading space:
leading space
leading space

Trim trailing space:
trailing spaceCombined:<ul>
\t<li>both</li>
</ul>end
`;
    }

    getContext() {
        return {
            leading: 'leading space',
            trailing: 'trailing space',
            both: 'both'
        }
    }
}
