`sandbox`
=========

{% raw %}

The `sandbox` tag can be used to enable the sandboxing mode for an included template:

````twig
{% sandbox %}
    {% include 'user.html' %}
{% endsandbox %}
````

> The `sandbox` tag can only be used to sandbox an include tag and it cannot be used to sandbox a section of a template. The following example won't work:

````twig
{% sandbox %}
    {% for i in 1..2 %}
        {{ i }}
    {% endfor %}
{% endsandbox %}
````

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/tags/index.md %})
