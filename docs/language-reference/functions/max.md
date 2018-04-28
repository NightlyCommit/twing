`max`
=====

{% raw %}

`max` returns the biggest value of a sequence or a set of values:

````twig
{{ max(1, 3, 2) }}
{{ max([1, 3, 2]) }}
````

When called with a hash, max ignores keys and only compares values:

````twig
{{ max({2: "e", 1: "a", 3: "b", 5: "d", 4: "c"}) }}
{# returns "e" #}
````

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/functions/index.md %})