`spaceless`
===========

> Use the [spaceless][spaceless-filter-url] filter instead.

{% raw %}

Use the `spaceless` tag to remove whitespace *between HTML tags*, not whitespace within HTML tags or whitespace in plain text:

```twig
{% spaceless %}
    <div>
        <strong>foo</strong>
    </div>
{% endspaceless %}

{# output will be <div><strong>foo</strong></div> #}
```

> For more information on whitespace control, read the [dedicated section][whitespace-control-url] of the documentation and learn how you can also use the whitespace control modifier on your tags.

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/tags/index.md %})

[spaceless-filter-url]: {{ site.baseurl }}{% link language-reference/filters/spaceless.md %}
[whitespace-control-url]: {{ site.baseurl }}{% link templates.md %}#whitespace-control