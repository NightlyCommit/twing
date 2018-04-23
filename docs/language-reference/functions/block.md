`block`
=======

{% raw %}

When a template uses inheritance and if you want to print a block multiple times, use the `block` function:

````twig
<title>{% block title %}{% endblock %}</title>

<h1>{{ block('title') }}</h1>

{% block body %}{% endblock %}
````

The `block` function can also be used to display one block of another template:

````twig
{{ block("title", "common_blocks.twig") }}
````

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/functions/index.md %})
