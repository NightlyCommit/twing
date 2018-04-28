`date`
======

{% raw %}

Converts an argument to a date to allow date comparison:

````twig
{% if date(user.created_at) < date('-2days') %}
    {# do something #}
{% endif %}
````
You can pass a timezone as the second argument:

````twig
{% if date(user.created_at) < date('-2days', 'Europe/Paris') %}
    {# do something #}
{% endif %}
````

If no argument is passed, the function returns the current date:

````twig
{% if date(user.created_at) < date() %}
    {# always! #}
{% endif %}
````

Arguments
---------

* `date`:     The date
* `timezone`: The timezone

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/functions/index.md %})