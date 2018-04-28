`format`
========

{% raw %}

The `format` filter formats a given string by replacing the placeholders:

````twig
{{ "I like %s and %s."|format(foo, "bar") }}

{# outputs I like foo and bar
   if the foo parameter equals to the foo string. #}
````

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})