`reverse`
=========

{% raw %}

The `reverse` filter reverses a sequence, a mapping, or a string:

````twig
{% for user in users|reverse %}
    ...
{% endfor %}

{{ '1234'|reverse }}

{# outputs 4321 #}
````

Arguments
---------

* `preserve_keys`: Preserve keys when reversing a mapping or a sequence.

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})