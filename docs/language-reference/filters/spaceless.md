`spaceless`
===========

{% raw %}

Use the `spaceless` filter to remove whitespace *between HTML tags*, not whitespace within HTML tags or whitespace in plain text:

```twig
{{
    "<div>
        <strong>foo</strong>
    </div>
    "|spaceless }}

{# output will be <div><strong>foo</strong></div> #}
```

You can combine `spaceless` with the `apply` tag to apply the transformation on large amounts of HTML:

```twig
{% apply spaceless %}
    <div>
        <strong>foo</strong>
    </div>
{% endapply %}

{# output will be <div><strong>foo</strong></div> #}
```

This tag is not meant to "optimize" the size of the generated HTML content but merely to avoid extra whitespace between HTML tags to avoid browser rendering quirks under some circumstances.

> For more information on whitespace control, read the [dedicated section][whitespace-control-url] of the documentation and learn how you can also use the whitespace control modifier on your tags.

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/tags/index.md %})

[whitespace-control-url]: {{ site.baseurl }}{% link templates.md %}#whitespace-control