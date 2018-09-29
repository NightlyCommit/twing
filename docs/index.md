# Forewords about terminology

In this documentation, the `Twig` term represents the Twig language *specifications*, not the SensioLabs PHP *implementation* of the language - implementation being known as `TwigPHP`. SensioLabs use `Twig` to talk about both the specifications of the language and their implementation, and their documentation mix both specifications and implementation details. This should be considered as an oversight instead of an official convention.

`Twing` is a Node.js implementation of `Twig` language specifications.

# Twing Documentation

Read the online documentation to learn more about Twing.

{% include toc.html items=site.data.navigation_documentation.docs %}

# [Twig Language Reference][language-reference-url]

Browse the online Twig language reference to learn more about built-in features.

<div>
    {% for section in site.data.navigation_reference.sections %}
        <h2>{{ section[1].title }}</h2>
        {% assign items = section[1].items %}
        {% include toc.html items=items %}
    {% endfor %}
</div>

[language-reference-url]: {{ site.baseurl }}{% link language-reference/index.md %}