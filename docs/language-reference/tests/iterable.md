`iterable`
==========

{% raw %}

`iterable` returns true if the variable is iterable:

````twig
{# evaluates to true if the foo variable is iterable #}
{% if users is iterable %}
    {% for user in users %}
        Hello {{ user }}!
    {% endfor %}
{% else %}
    {# users is probably a string #}
    Hello {{ users }}!
{% endif %}
````

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/tests/index.md %})
