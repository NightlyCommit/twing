`macro`
=======

{% raw %}

Macros are comparable with functions in regular programming languages. They are useful to reuse template fragments to not repeat yourself.

Macros are defined in regular templates.

Imagine having a generic helper template that define how to render HTML forms via macros (called `forms.html`):

````twig
{% macro input(name, value, type = "text", size) %}
    <input type="{{ type }}" name="{{ name }}" value="{{ value|e }}" size="{{ size|default(20) }}" />
{% endmacro %}

{% macro textarea(name, value, rows = 10, cols = 40) %}
    <textarea name="{{ name }}" rows="{{ rows }}" cols="{{ cols }}">{{ value|e }}</textarea>
{% endmacro %}
````

Each macro argument can have a default value (here `text` is the default value for `type` if not provided in the call).

> You can pass the whole context as an argument by using the special `_context` variable.

Importing Macros
----------------

There are two ways to import macros. You can import the complete template containing the macros into a local variable (via the `import` tag) or only import specific macros from the template (via the `from` tag).

To import all macros from a template into a local variable, use the `import` tag:

````twig
{% import "forms.html" as forms %}
````

The above `import` call imports the `forms.html` file (which can contain only macros, or a template and some macros), and import the macros as items of the `forms` local variable.

The macros can then be called at will in the *current* template:

The macro can then be called at will:

````twig
    <p>{{ forms.input('username') }}</p>
    <p>{{ forms.input('password', null, 'password') }}</p>
````

Alternatively you can import names from the template into the current namespace via the `from` tag:

````twig
{% from 'forms.html' import input as input_field, textarea %}

<p>{{ input_field('password', '', 'password') }}</p>
<p>{{ textarea('comment') }}</p>
````

> When macro usages and definitions are in the same template, you don't need to import the macros as they are automatically available under the special `_self` variable:

````twig
<p>{{ _self.input('password', '', 'password') }}</p>

{% macro input(name, value, type = "text", size = 20) %}
    <input type="{{ type }}" name="{{ name }}" value="{{ value|e }}" size="{{ size }}" />
{% endmacro %}
````

Macros Scoping
--------------

The scoping rules are the same whether you imported macros via `import` or `from`.

Imported macros are always **local** to the current template. It means that macros are available in all blocks and other macros defined in the current template, but they are not available in included templates or child templates; you need to explicitly re-import macros in each template.

When calling `import` or `from` from a `block` tag, the imported macros are only defined in the current block and they override macros defined at the template level with the same names.

When calling `import` or `from` from a `macro` tag, the imported macros are only defined in the current macro and they override macros defined at the template level with the same names.

Checking if a Macro is defined
------------------------------

You can check if a macro is defined via the `defined` test:

````twig
{% import "macros.twig" as macros %}

{% from "macros.twig" import hello %}

{% if macros.hello is defined -%}
    OK
{% endif %}

{% if hello is defined -%}
    OK
{% endif %}
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
