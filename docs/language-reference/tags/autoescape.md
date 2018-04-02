`autoescape`
============

{% raw %}

Force the escaping strategy of a section of a template.

````twig
{# Mark the section as needing escaping using HTML strategy #}
{% autoescape %}{% endautoescape %}

{# Mark the section as needing escaping using HTML strategy #}
{% autoescape 'html' %}{% endautoescape %}

{# Mark the section as needing escaping using JS strategy #}
{% autoescape 'js' %}{% endautoescape %}

{# Mark the section as not needing escaping #}
{% autoescape false %}{% endautoescape %}
````

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/tags/index.md %})

