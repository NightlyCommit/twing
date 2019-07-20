`filter`
========

> You should use the `apply` tag instead which does the same thing except that the wrapped template data is not scoped.

{% raw %}

Filter sections allow you to apply filters on a block of template data. Just wrap the code in the special `filter` section:

````twig
{% filter upper %}
    This text becomes uppercase
{% endfilter %}
````

You can also chain filters:

````twig
{% filter lower|escape %}
    <strong>SOME TEXT</strong>
{% endfilter %}

{# outputs "&lt;strong&gt;some text&lt;/strong&gt;" #}
````
{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/tags/index.md %})
