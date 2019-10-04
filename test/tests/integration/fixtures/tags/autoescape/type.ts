import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'escape types';
    }

    getTemplates() {
        return {
            'index.twig': `

1. autoescape 'html' |escape('js')

{% autoescape 'html' %}
<a onclick="alert(&quot;{{ msg|escape('js') }}&quot;)"></a>
{% endautoescape %}

2. autoescape 'html' |escape('js')

{% autoescape 'html' %}
<a onclick="alert(&quot;{{ msg|escape('js') }}&quot;)"></a>
{% endautoescape %}

3. autoescape 'js' |escape('js')

{% autoescape 'js' %}
<a onclick="alert(&quot;{{ msg|escape('js') }}&quot;)"></a>
{% endautoescape %}

4. no escape

{% autoescape false %}
<a onclick="alert(&quot;{{ msg }}&quot;)"></a>
{% endautoescape %}

5. |escape('js')|escape('html')

{% autoescape false %}
<a onclick="alert(&quot;{{ msg|escape('js')|escape('html') }}&quot;)"></a>
{% endautoescape %}

6. autoescape 'html' |escape('js')|escape('html')

{% autoescape 'html' %}
<a onclick="alert(&quot;{{ msg|escape('js')|escape('html') }}&quot;)"></a>
{% endautoescape %}
`
        };
    }

    getExpected() {
        return `

1. autoescape 'html' |escape('js')

<a onclick="alert(&quot;\\u003C\\u003E\\n\\u0027\\u0022&quot;)"></a>

2. autoescape 'html' |escape('js')

<a onclick="alert(&quot;\\u003C\\u003E\\n\\u0027\\u0022&quot;)"></a>

3. autoescape 'js' |escape('js')

<a onclick="alert(&quot;\\u003C\\u003E\\n\\u0027\\u0022&quot;)"></a>

4. no escape

<a onclick="alert(&quot;<>
'"&quot;)"></a>

5. |escape('js')|escape('html')

<a onclick="alert(&quot;\\u003C\\u003E\\n\\u0027\\u0022&quot;)"></a>

6. autoescape 'html' |escape('js')|escape('html')

<a onclick="alert(&quot;\\u003C\\u003E\\n\\u0027\\u0022&quot;)"></a>

`;
    }

    getContext() {
        return {
            'msg': `<>\n'"`
        };
    }
}
