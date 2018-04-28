`split`
=======

{% raw %}

The `split` filter splits a string by the given delimiter and returns a list of strings:

````twig
{% set foo = "one,two,three"|split(',') %}
{# foo contains ['one', 'two', 'three'] #}
````

You can also pass a `limit` argument:

 * If `limit` is positive, the returned array will contain a maximum of limit elements with the last element containing the rest of string;
 * If `limit` is negative, all components except the last -limit are returned;
 * If `limit` is zero, then this is treated as 1.

````twig
{% set foo = "one,two,three,four,five"|split(',', 3) %}
{# foo contains ['one', 'two', 'three,four,five'] #}
````

If the `delimiter` is an empty string, then value will be split by equal chunks. Length is set by the `limit` argument (one character by default).

````twig
{% set foo = "123"|split('') %}
{# foo contains ['1', '2', '3'] #}

{% set bar = "aabbcc"|split('', 2) %}
{# bar contains ['aa', 'bb', 'cc'] #}
````

Arguments
---------

* `delimiter`: The delimiter
* `limit`:     The limit argument

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})