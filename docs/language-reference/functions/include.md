`include`
=========

{% raw %}

The `include` function returns the rendered content of a template:

````twig
{{ include('template.html') }}
{{ include(some_var) }}
````

Included templates have access to the variables of the active context.

The context is passed by default to the template but you can also pass
additional variables:

````twig
{# template.html will have access to the variables from the current context and the additional ones provided #}
{{ include('template.html', {foo: 'bar'}) }}
````

You can disable access to the context by setting `with_context` to `false`:

````twig
{# only the foo variable will be accessible #}
{{ include('template.html', {foo: 'bar'}, with_context = false) }}
````

````twig
{# no variables will be accessible #}
{{ include('template.html', with_context = false) }}
````

When you set the `ignore_missing` flag, Twig will return an empty string if the template does not exist:

````twig
{{ include('sidebar.html', ignore_missing = true) }}
````

You can also provide a list of templates that are checked for existence before inclusion. The first template that exists will be rendered:

````twig
{{ include(['page_detailed.html', 'page.html']) }}
````

If `ignore_missing` is set, it will fall back to rendering nothing if none of the templates exist, otherwise it will throw an exception.

Arguments
---------

* `template`:       The template to render
* `variables`:      The variables to pass to the template
* `with_context`:   Whether to pass the current context variables or not
* `ignore_missing`: Whether to ignore missing templates or not
* `sandboxed`:      Whether to sandbox the template or not

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/functions/index.md %})