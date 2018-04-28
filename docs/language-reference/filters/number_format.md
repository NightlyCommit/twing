`number_format`
===============

{% raw %}

The `number_format` filter formats numbers:

````twig
{{ 200.35|number_format }}
````

You can control the number of decimal places, decimal point, and thousands separator using the additional arguments:

````twig
{{ 9800.333|number_format(2, '.', ',') }}
````

If no formatting options are provided then Twig will use the default formatting options of:

* 0 decimal places.
* `.` as the decimal point.
* `,` as the thousands separator.

Arguments
---------

* `decimal`:       The number of decimal points to display
* `decimal_point`: The character(s) to use for the decimal point
* `thousand_sep`:   The character(s) to use for the thousands separator

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/filters/index.md %})