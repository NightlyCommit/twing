`merge`
=======

{% raw %}

The `merge` filter merges an array with another array:

````twig
    {% set values = [1, 2] %}

    {% set values = values|merge(['apple', 'orange']) %}

    {# values now contains [1, 2, 'apple', 'orange'] #}
````

New values are added at the end of the existing ones.

The `merge` filter also works on hashes:

````twig
{% set items = { 'apple': 'fruit', 'orange': 'fruit', 'peugeot': 'unknown' } %}

{% set items = items|merge({ 'peugeot': 'car', 'renault': 'car' }) %}

{# items now contains { 'apple': 'fruit', 'orange': 'fruit', 'peugeot': 'car', 'renault': 'car' } #}
````

For hashes, the merging process occurs on the keys: if the key does not already exist, it is added but if the key already exists, its value is overridden.

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})