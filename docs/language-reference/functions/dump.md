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

> The dump function is not available by default. You must add the TwingExtensionDebug extension explicitly when creating your Twing environment:
>
> ````js
> const {TwingEnvironment, TwingExtensionDebug} = require('twing');
>
> let env = new TwingEnvironment(loader, {
>    debug: true
> });
>
> env.addExtension(new TwingExtensionDebug());
> ````
>
> Even when enabled, the dump function won't display anything if the debug option on the environment is not enabled.

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