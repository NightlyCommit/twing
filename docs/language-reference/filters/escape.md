`escape`
========

{% raw %}

The `escape` filter escapes a string for safe insertion into the final output. It supports different escaping strategies depending on the template context.

By default, it uses the HTML escaping strategy:

````twig
{{ user.username|escape }}
````

The `e` filter is defined as an alias:

````twig
{{ user.username|e }}
````

The `escape` filter can also be used in other contexts than HTML thanks to an optional argument which defines the escaping strategy to use:

````twig
{{ user.username|e }}
{# is equivalent to #}
{{ user.username|e('html') }}
````

The `escape` filter supports the following escaping strategies:

* `html`: escapes a string for the **HTML body** context.
* `js`: escapes a string for the **JavaScript context**.
* `css`: escapes a string for the **CSS context**. CSS escaping can be applied to any string being inserted into CSS and escapes everything except alphanumerics.
* `url`: escapes a string for the **URI or parameter contexts**. This should not be used to escape an entire URI; only a subcomponent being inserted.
* `html_attr`: escapes a string for the **HTML attribute** context.

Arguments
---------

* `strategy`: The escaping strategy
* `charset`:  The string charset

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})