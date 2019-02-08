`deprecated`
============

{% raw %}

Generates a deprecation notice where the `deprecated` tag is used in a template:

````twig
{# base.twig #}
{% deprecated 'The "base.twig" template is deprecated, use "layout.twig" instead.' %}
{% extends 'layout.twig' %}
````

Also you can deprecate a block in the following way:

````twig
{% block hey %}
    {% deprecated 'The "hey" block is deprecated, use "greet" instead.' %}
    {{ block('greet') }}
{% endblock %}

{% block greet %}
    Hey you!
{% endblock %}
````

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/tags/index.md %})
