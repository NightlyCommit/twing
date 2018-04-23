`source`
========

{% raw %}

The `source` function returns the content of a template without rendering it:

````twig
{{ source('template.html') }}
{{ source(some_var) }}
````

When you set the `ignore_missing` flag, Twig will return an empty string if the template does not exist:

````twig
{{ source('template.html', ignore_missing = true) }}
````

Arguments
---------

* `name`: The name of the template to read
* `ignore_missing`: Whether to ignore missing templates or not

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/functions/index.md %})