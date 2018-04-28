`trim`
======

{% raw %}

The `trim` filter strips whitespace (or other characters) from the beginning and end of a string:

````twig
{{ '  I like Twig.  '|trim }}

{# outputs 'I like Twig.' #}

{{ '  I like Twig.'|trim('.') }}

{# outputs '  I like Twig' #}

{{ '  I like Twig.  '|trim(side='left') }}

{# outputs 'I like Twig.  ' #}

{{ '  I like Twig.  '|trim(' ', 'right') }}

{# outputs '  I like Twig.' #}
````

Arguments
---------

* `character_mask`: The characters to strip
* `side`: The default is to strip from the left and the right (`both`) sides, but `left` and `right` will strip from either the left side or right side only

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})