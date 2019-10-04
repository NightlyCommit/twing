import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"autoescape" tag applies escaping after calling functions';
    }

    getTemplates() {
        return {
            'index.twig': `

autoescape false
{% autoescape false %}

    safe_br
    {{ safe_br() }}

    unsafe_br
    {{ unsafe_br() }}

{% endautoescape %}

autoescape 'html'
{% autoescape 'html' %}

    safe_br
    {{ safe_br() }}

    unsafe_br
    {{ unsafe_br() }}

    unsafe_br()|raw
    {{ (unsafe_br())|raw }}

    safe_br()|escape
    {{ (safe_br())|escape }}

    safe_br()|raw
    {{ (safe_br())|raw }}

    unsafe_br()|escape
    {{ (unsafe_br())|escape }}

{% endautoescape %}

autoescape js
{% autoescape 'js' %}

    safe_br
    {{ safe_br() }}

{% endautoescape %}`
        };
    }

    getExpected() {
        return `

autoescape false

    safe_br
    <br />

    unsafe_br
    <br />


autoescape 'html'

    safe_br
    <br />

    unsafe_br
    &lt;br /&gt;

    unsafe_br()|raw
    <br />

    safe_br()|escape
    &lt;br /&gt;

    safe_br()|raw
    <br />

    unsafe_br()|escape
    &lt;br /&gt;


autoescape js

    safe_br
    \\u003Cbr\\u0020\\/\\u003E

`;
    }

    getContext() {
        return {
            'var': '<br />'
        };
    }
}
