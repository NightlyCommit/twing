`default`
=========

{% raw %}

The `default` filter returns the passed default value if the value is undefined or empty, otherwise the value of the variable:

````twig
{{ var|default('var is not defined') }}

{{ var.foo|default('foo item on var is not defined') }}

{{ var['foo']|default('foo item on var is not defined') }}

{{ ''|default('passed var is empty')  }}
````

Arguments
---------

* `default`: The default value

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})