`dump`
======

{% raw %}

The `dump` function dumps information about a template variable. This is mostly useful to debug a template that does not behave as expected by introspecting its variables:

````twig
{{ dump(user) }}
````

In an HTML context, wrap the output with a `pre` tag to make it easier to read:

````html
<pre>
    {{ dump(user) }}
</pre>
````

You can debug several variables by passing them as additional arguments:

````twig
{{ dump(user, categories) }}
````

If you don't pass any value, all variables from the current context are
dumped:

````twig
{{ dump() }}
````

Arguments
---------

* `context`: The context to dump

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/functions/index.md %})