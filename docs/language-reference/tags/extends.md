`extends`
=========

{% raw %}

The `extends` tag can be used to extend a template from another one.

> Twig does not support multiple inheritance. So you can only have one extends tag called per rendering. However, Twig supports horizontal [reuse][use-tag-url].

Let's define a base template, `base.html`, which defines a simple HTML skeleton document:

````twig
<!DOCTYPE html>
<html>
    <head>
        {% block head %}
            <link rel="stylesheet" href="style.css" />
            <title>{% block title %}{% endblock %} - My Webpage</title>
        {% endblock %}
    </head>
    <body>
        <div id="content">{% block content %}{% endblock %}</div>
        <div id="footer">
            {% block footer %}
                &copy; Copyright 2011 by <a href="http://domain.invalid/">you</a>.
            {% endblock %}
        </div>
    </body>
</html>
````

In this example, the [`block`][block-tag-url] tags define four blocks that child templates can fill in.

All the `block` tag does is to tell the template engine that a child template may override those portions of the template.

## Child Template

A child template might look like this:

````twig
{% extends "base.html" %}

{% block title %}Index{% endblock %}
{% block head %}
    {{ parent() }}
    <style type="text/css">
        .important { color: #336699; }
    </style>
{% endblock %}
{% block content %}
    <h1>Index</h1>
    <p class="important">
        Welcome on my awesome homepage.
    </p>
{% endblock %}
````

The `extends` tag is the key here. It tells the template engine that this template "extends" another template. When the template system evaluates this template, first it locates the parent. The extends tag should be the first tag in the template.

Note that since the child template doesn't define the `footer` block, the value from the parent template is used instead.

You can't define multiple `block` tags with the same name in the same template. This limitation exists because a block tag works in "both" directions. That is, a block tag doesn't just provide a hole to fill - it also defines the content that fills the hole in the *parent*. If there were two similarly-named `block` tags in a template, that template's parent wouldn't know which one of the blocks' content to use.

If you want to print a block multiple times you can however use the `block` function:

````twig
<title>{% block title %}{% endblock %}</title>
<h1>{{ block('title') }}</h1>
{% block body %}{% endblock %}
````

## Parent Blocks

It's possible to render the contents of the parent block by using the [`parent`][parent-function-url] function. This gives back the results of the parent block:

````twig
{% block sidebar %}
    <h3>Table Of Contents</h3>
    ...
    {{ parent() }}
{% endblock %}
````

## Named Block End-Tags

Twig allows you to put the name of the block after the end tag for better readability:

````twig
{% block sidebar %}
    {% block inner_sidebar %}
        ...
    {% endblock inner_sidebar %}
{% endblock sidebar %}
````

Of course, the name after the `endblock` word must match the block name.

## Block Nesting and Scope

Blocks can be nested for more complex layouts. Per default, blocks have access to variables from outer scopes:

````twig
{% for item in seq %}
    <li>{% block loop_item %}{{ item }}{% endblock %}</li>
{% endfor %}
````

## Block Shortcuts

For blocks with little content, it's possible to use a shortcut syntax. The following constructs do the same thing:

````twig
{% block title %}
    {{ page_title|title }}
{% endblock %}
````

````twig
{% block title page_title|title %}
````

## Dynamic Inheritance

Twig supports dynamic inheritance by using a variable as the base template:

````twig
{% extends some_var %}
````

You can also provide a list of templates that are checked for existence. The
first template that exists will be used as a parent:

````
{% extends ['layout.html', 'base_layout.html'] %}
````

## Conditional Inheritance

As the template name for the parent can be any valid Twig expression, it's possible to make the inheritance mechanism conditional:

````twig
{% extends standalone ? "minimum.html" : "base.html" %}
````

In this example, the template will extend the "minimum.html" layout template if the `standalone` variable evaluates to `true`, and "base.html" otherwise.

## How do blocks work?

A block provides a way to change how a certain part of a template is rendered but it does not interfere in any way with the logic around it.

Let's take the following example to illustrate how a block works and more importantly, how it does not work:

````twig
{# base.twig #}

{% for post in posts %}
    {% block post %}
        <h1>{{ post.title }}</h1>
        <p>{{ post.body }}</p>
    {% endblock %}
{% endfor %}
````

If you render this template, the result would be exactly the same with orwithout the `block` tag. The `block` inside the `for` loop is just a way to make it overridable by a child template:

````twig
{# child.twig #}

{% extends "base.twig" %}

{% block post %}
    <article>
        <header>{{ post.title }}</header>
        <section>{{ post.text }}</section>
    </article>
{% endblock %}
````

Now, when rendering the child template, the loop is going to use the block defined in the child template instead of the one defined in the base one; the executed template is then equivalent to the following one:

````twig
{% for post in posts %}
    <article>
        <header>{{ post.title }}</header>
        <section>{{ post.text }}</section>
    </article>
{% endfor %}
````

Let's take another example: a block included within an ``if`` statement:

````twig
{% if posts is empty %}
    {% block head %}
        {{ parent() }}

        <meta name="robots" content="noindex, follow">
    {% endblock head %}
{% endif %}
````

Contrary to what you might think, this template does not define a block conditionally; it just makes overridable by a child template the output of what will be rendered when the condition is `true`.

If you want the output to be displayed conditionally, use the following instead:

````twig
{% block head %}
    {{ parent() }}

    {% if posts is empty %}
        <meta name="robots" content="noindex, follow">
    {% endif %}
{% endblock head %}
````

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/tags/index.md %})

[block-tag-url]: {{ site.baseurl }}{% link language-reference/tags/block.md %}
[use-tag-url]: {{ site.baseurl }}{% link language-reference/tags/use.md %}
[parent-function-url]: {{ site.baseurl }}{% link language-reference/functions/parent.md %}

