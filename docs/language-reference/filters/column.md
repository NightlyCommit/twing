`column`
========

{% raw %}

The `column` filter returns the values from a single column in the input array.

```twig
{% set items = [{ 'fruit' : 'apple'}, {'fruit' : 'orange' }] %}

{% set fruits = items|column('fruit') %}

{# fruits now contains ['apple', 'orange'] #}
```

Arguments
---------

* `name`: The column name to extract

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})