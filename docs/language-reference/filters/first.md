`first`
=======

{% raw %}

The `first` filter returns the first "element" of a sequence, a mapping, or a string:

````twig
{{ [1, 2, 3, 4]|first }}
{# outputs 1 #}

{{ { a: 1, b: 2, c: 3, d: 4 }|first }}
{# outputs 1 #}

{{ '1234'|first }}
{# outputs 1 #}
````

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})