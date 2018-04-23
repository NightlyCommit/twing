`template_from_string`
======================

{% raw %}

The `template_from_string` function loads a template from a string:

````twig
{{ include(template_from_string("Hello {{ name }}")) }}
{{ include(template_from_string(page.template)) }}
````

Arguments
---------

* `template`: The template

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/functions/index.md %})