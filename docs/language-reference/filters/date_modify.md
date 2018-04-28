`date_modify`
=============

{% raw %}

The `date_modify` filter modifies a date with a given modifier string:

````twig
{{ post.published_at|date_modify("+1 day")|date("m/d/Y") }}
````

Arguments
---------

* `modifier`: The modifier

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})