# Known issues

This document lists the known issues of Twing regarding Twig specifications implementation.

{% raw %}

## `filter` tag doesn't create a new context scope

> Will be addressed by Twing 3

Twig `filter` tag [documentation][filter-tag-doc] has been updated on April 2019 to explicitly indicate that the `filter` tag creates a new context scope. This was not known until then and Twing doesn't support that feature. When used with Twing, the `filter` tag will _not_ create a new context scope.

For example, the following template works perfectly with Twing but fails with TwigPHP (throwing a `Variable "foo" does not exist` error):

```twig
{% filter upper %}
    {% set foo = "bar" %} 
{% endfilter %}
{{ foo }}
```

Don't rely on this faulty implementation detail if you want to preserve your templates compatibility with other implementations.

{% endraw %}

[back]({{ site.baseurl }}{% link index.md %})

[filter-tag-doc]: https://twig.symfony.com/doc/2.x/tags/filter.html
