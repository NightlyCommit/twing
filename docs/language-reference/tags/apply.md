`apply`
=======

{% raw %}

Filter sections allow you to apply filters on a block of template data. Just wrap the code in the special `apply` section:

````twig
{% apply upper %}
    This text becomes uppercase
{% endapply %}
````

You can also chain filters:

````twig
{% apply lower|escape %}
    <strong>SOME TEXT</strong>
{% endapply %}

{# outputs "&lt;strong&gt;some text&lt;/strong&gt;" #}
````
{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/tags/index.md %})
