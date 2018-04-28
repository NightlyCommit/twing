`date`
======

{% raw %}

The `date` filter formats a date to a given format:

````twig
{{ post.published_at|date("m/d/Y") }}
````

Arguments
---------

* `format`:   The date format
* `timezone`: The date timezone

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})
