`parent`
========

{% raw %}

When a template uses inheritance, it's possible to render the contents of the parent block when overriding a block by using the `parent` function:

````twig
{% extends "base.html" %}

{% block sidebar %}
    <h3>Table Of Contents</h3>
    ...
    {{ parent() }}
{% endblock %}
````

The `parent()` call will return the content of the `sidebar` block as defined in the `base.html` template.

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/functions/index.md %})
