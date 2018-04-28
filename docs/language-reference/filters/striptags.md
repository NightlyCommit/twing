`striptags`
===========

{% raw %}

The `striptags` filter strips SGML/XML tags and replace adjacent whitespace by one space:

````twig
{{ some_html|striptags }}
````

You can also provide tags which should not be stripped:

````twig
{{ some_html|striptags('<br><p>') }}
````

In this example, the `<br/>`, `<br>`, `<p>`, and `</p>` tags won't be removed from the string.

Arguments
---------

* `allowable_tags`: Tags which should not be stripped

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})