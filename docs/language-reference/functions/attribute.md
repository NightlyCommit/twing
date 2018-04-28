`attribute`
===========

{% raw %}

The `attribute` function can be used to access a "dynamic" attribute of a variable:

````twig
{{ attribute(object, method) }}
{{ attribute(object, method, arguments) }}
{{ attribute(array, item) }}
````

> The resolution algorithm is the same as the one used for the `.` notation, except that the item can be any valid expression.

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/functions/index.md %})

