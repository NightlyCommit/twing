`replace`
=========

{% raw %}

The `replace` filter formats a given string by replacing the placeholders (placeholders are free-form):

````twig
{{ "I like %this% and %that%."|replace({'%this%': foo, '%that%': "bar"}) }}

{# outputs I like foo and bar
   if the foo parameter equals to the foo string. #}
   
{# using % as a delimiter is purely conventional and optional #}

{{ "I like this and --that--."|replace({'this': foo, '--that--': "bar"}) }}

{# outputs I like foo and bar #}
````

Arguments
---------

* `from`: The placeholder values

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})