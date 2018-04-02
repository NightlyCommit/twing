`include`
=========

{% raw %}

The `include` statement includes a template and returns the rendered content of that file into the current namespace:

````twig
{% include 'header.html' %}
    Body
{% include 'footer.html' %}
````

Included templates have access to the variables of the active context.

You can add additional variables by passing them after the `with` keyword:

````twig
{# template.html will have access to the variables from the current context and the additional ones provided #}
{% include 'template.html' with {'foo': 'bar'} %}

{% set vars = {'foo': 'bar'} %}
{% include 'template.html' with vars %}
````

You can disable access to the context by appending the `only` keyword:

````twig
{# only the foo variable will be accessible #}
{% include 'template.html' with {'foo': 'bar'} only %}
````

````twig
{# no variables will be accessible #}
{% include 'template.html' only %}
````

The template name can be any valid Twig expression:

````twig
{% include some_var %}
{% include ajax ? 'ajax.html' : 'not_ajax.html' %}
````

You can mark an include with `ignore missing` in which case Twig will ignore the statement if the template to be included does not exist. It has to be placed just after the template name. Here some valid examples:

````twig
{% include 'sidebar.html' ignore missing %}
{% include 'sidebar.html' ignore missing with {'foo': 'bar'} %}
{% include 'sidebar.html' ignore missing only %}
````

You can also provide a list of templates that are checked for existence before inclusion. The first template that exists will be included:

````twig
    {% include ['page_detailed.html', 'page.html'] %}
````

If `ignore missing` is given, it will fall back to rendering nothing if none of the templates exist, otherwise it will throw an exception.

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/tags/index.md %})