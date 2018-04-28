`nl2br`
=======

{% raw %}

The `nl2br` filter inserts HTML line breaks before all newlines in a string:

````twig
{{ "I like Twig.\nYou will like it too."|nl2br }}
{# outputs

    I like Twig.<br />
    You will like it too.

#}
````

> The `nl2br` filter pre-escapes the input before applying the transformation.

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})