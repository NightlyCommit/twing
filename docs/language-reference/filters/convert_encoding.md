`convert_encoding`
==================

{% raw %}

The `convert_encoding` filter converts a string from one encoding to another. The first argument is the expected output charset and the second one is the input charset:

````twig
{{ data|convert_encoding('UTF-8', 'iso-2022-jp') }}
````

Arguments
---------

* `to`:   The output charset
* `from`: The input charset

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})