`macro`
=======

{% raw %}

Macros are comparable with functions in regular programming languages. They are useful to put often used HTML idioms into reusable elements to not repeat yourself.

Here is a small example of a macro that renders a form element:

````twig
{% macro input(name, value, type, size) %}
    <input type="{{ type|default('text') }}" name="{{ name }}" value="{{ value|e }}" size="{{ size|default(20) }}" />
{% endmacro %}
````

> You can pass the whole context as an argument by using the special `_context` variable.

## Import

Macros can be defined in any template, and need to be "imported" before being used (see the documentation for the [`import`][import-tag-url] tag for more information):

````twig
{% import "forms.html" as forms %}
````

The above `import` call imports the "forms.html" file (which can contain only macros, or a template and some macros), and import the functions as items of the `forms` variable.

The macro can then be called at will:

````twig
    <p>{{ forms.input('username') }}</p>
    <p>{{ forms.input('password', null, 'password') }}</p>
````

If macros are defined and used in the same template, you can use the special `_self` variable to import them:

````twig
    {% import _self as forms %}

    <p>{{ forms.input('username') }}</p>
````

When you want to use a macro in another macro from the same file, you need to import it locally:

````twig
{% macro input(name, value, type, size) %}
    <input type="{{ type|default('text') }}" name="{{ name }}" value="{{ value|e }}" size="{{ size|default(20) }}" />
{% endmacro %}

{% macro wrapped_input(name, value, type, size) %}
    {% import _self as forms %}

    <div class="field">
        {{ forms.input(name, value, type, size) }}
    </div>
{% endmacro %}
````

## Named Macro End-Tags

Twig allows you to put the name of the macro after the end tag for better readability:

````twig
{% macro input() %}
    ...
{% endmacro input %}
````

Of course, the name after the `endmacro` word must match the macro name.

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/tags/index.md %})

[import-tag-url]: {{ site.baseurl }}{% link language-reference/tags/import.md %}
