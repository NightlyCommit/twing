Recipes
=======

{% raw %}

## Making a Layout conditional

Working with Ajax means that the same content is sometimes displayed as is, and sometimes decorated with a layout. As Twig layout template names can be any valid expression, you can pass a variable that evaluates to `true` when the request is made via Ajax and choose the layout accordingly:

````twig
{% extends request.ajax ? "base_ajax.html" : "base.html" %}

{% block content %}
    This is the content to be displayed.
{% endblock %}
````

## Making an Include dynamic

When including a template, its name does not need to be a string. For instance, the name can depend on the value of a variable:

````twig
{% include var ~ '_foo.html' %}
````

If `var` evaluates to `index`, the `index_foo.html` template will be rendered.

As a matter of fact, the template name can be any valid expression, such as the following:

````twig
{% include var|default('index') ~ '_foo.html' %}
````

## Overriding a Template that also extends itself

A template can be customized in two different ways:

* *Inheritance*: A template *extends* a parent template and overrides some blocks;

* *Replacement*: If you use the filesystem loader, Twig loads the first template it finds in a list of configured directories; a template found in a directory *replaces* another one from a directory further in the list.

But how do you combine both: *replace* a template that also extends itself (aka a template in a directory further in the list)?

Let's say that your templates are loaded from both `../templates/mysite` and `../templates/default` in this order. The `page.twig` template, stored in `../templates/default` reads as follows:

````twig
{# page.twig #}
{% extends "layout.twig" %}

{% block content %}
{% endblock %}
````

You can replace this template by putting a file with the same name in `../templates/mysite`. And if you want to extend the original template, you might be tempted to write the following:

````twig
{# page.twig in ../templates/mysite #}
{% extends "page.twig" %} {# from ../templates/default #}
````

Of course, this will not work as Twing will always load the template from `../templates/mysite`.

It turns out it is possible to get this to work, by adding a directory right at the end of your template directories, which is the parent of all of the other directories: `../templates` in our case. This has the effect of making every template file within our system uniquely addressable. Most of the time you will use the "normal" paths, but in the special case of wanting to extend a template with an overriding version of itself we can reference its parent's full, unambiguous template path in the extends tag:

````twig
{# page.twig in .../templates/mysite #}
{% extends "default/page.twig" %} {# from .../templates #}
````

> This recipe was inspired by the following Django wiki page: http://code.djangoproject.com/wiki/ExtendingTemplates

## Customizing the Syntax

Twing allows some syntax customization for the block delimiters. It's not recommended to use this feature as templates will be tied with your custom syntax. But for specific projects, it can make sense to change the defaults.

To change the block delimiters, you need to create your own lexer object:

````javascript
let twing = new Twing.TwingEnvironment(...);

let lexer = new Twing.TwingLexer(twing, {
    'tag_comment': ['{#', '#}'],
    'tag_block': ['{%', '%}'],
    'tag_variable': ['{{', '}}'],
    'interpolation': ['#{', '}']
});

twing.setLexer(lexer);
````

Here are some configuration example that simulates some other template engines syntax:

````javascript
// Ruby erb syntax
let lexer = new Twing.TwingLexer(twing, {
    'tag_comment': ['<%#', '%>'],
    'tag_block':  ['<%', '%>'],
    'tag_variable': ['<%=', '%>']
});
````

````javascript
// SGML Comment Syntax
let lexer = new Twing.TwingLexer(twing, {
    'tag_comment': ['<!--#', '-->'],
    'tag_block': ['<!--', '-->'],
    'tag_variable': ['${', '}']
});
````

````javascript
// Smarty like
let lexer = new Twing.TwingLexer(twing, {
    'tag_comment': ['{*', '*}'],
    'tag_block': ['{', '}'],
    'tag_variable': ['{$', '}']
});
````

## Accessing the parent Context in Nested Loops

Sometimes, when using nested loops, you need to access the parent context. The parent context is always accessible via the `loop.parent` variable. For instance, if you have the following template data:

````javascript
let data = {
    'topics': {
        'topic1': ['Message 1 of topic 1', 'Message 2 of topic 1'],
        'topic2': ['Message 1 of topic 2', 'Message 2 of topic 2']
    }
};
````

And the following template to display all messages in all topics:

````twig
{% for topic, messages in topics %}
    * {{ loop.index }}: {{ topic }}
  {% for message in messages %}
      - {{ loop.parent.loop.index }}.{{ loop.index }}: {{ message }}
  {% endfor %}
{% endfor %}
````

The output will be similar to:

````html
* 1: topic1
  - 1.1: The message 1 of topic 1
  - 1.2: The message 2 of topic 1
* 2: topic2
  - 2.1: The message 1 of topic 2
  - 2.2: The message 2 of topic 2
````

In the inner loop, the `loop.parent` variable is used to access the outer context. So, the index of the current `topic` defined in the outer for loop is accessible via the `loop.parent.loop.index` variable.

## Defining undefined Functions and Filters on the Fly

When a function (or a filter) is not defined, Twing defaults to throw a `TwingErrorSyntax` errot. However, it can also call a `callback` (any valid JavaScript callable) which should return a function (or a filter).

For filters, register callbacks with `registerUndefinedFilterCallback()`. For functions, use `registerUndefinedFunctionCallback()`:

````javascript
// auto-register all global JavaScript functions as Twing functions
// don't try this at home as it's not secure at all!
twing.registerUndefinedFunctionCallback(function (name) {
    if (typeof global.name === 'function') {
        return new TwingFunction(name, name);
    }

    return false;
});
````

If the callable is not able to return a valid function (or filter), it must return `false`.

If you register more than one callback, Twing will call them in turn until one does not return `false`.

> As the resolution of functions and filters is done during compilation, there is no overhead when registering these callbacks.

## Validating the Template Syntax

When template code is provided by a third-party (through a web interface for instance), it might be interesting to validate the template syntax before saving it. If the template code is stored in a `template` variable, here is how you can do it::

````javascript
try {
    twing.parse(twing.tokenize(new Twing.TwingSource(template)));

    // the template is valid
}
catch (e) {
    if (e instanceof Twing.TwingErrorSyntax) {
        // template contains one or more syntax errors
    }
}
````

If you iterate over a set of files, you can pass the filename to the `tokenize()` method to get the filename in the exception message:

````javascript
for (let file of files) {
    try {
        twing.parse(twing.tokenize(new Twing.TwingSource(template, file.filename, file.path)));

        // the template is valid
    } 
    catch (e) {
        if (e instanceof Twing.TwingErrorSyntax) {
            // template contains one or more syntax errors
        }    
    }
}
````

> This method won't catch any sandbox policy violations because the policy is enforced during template rendering (as Twing needs the context for some checks like allowed methods on objects).

## Reusing a stateful Node Visitor

When attaching a visitor to a `TwingEnvironment` instance, Twing uses it to visit *all* templates it compiles. If you need to keep some state information around, you probably want to reset it when visiting a new template.

This can be easily achieved with the following code::

````javascript
let someTemplateState = {};

enterNode(node, env) {
    if (node instanceof TwingNodeModule) {
        // reset the state as we are entering a new template
        this.someTemplateState = {};
    }

    // ...

    return node;
}
````

## Loading a Template from a String

From a template, you can easily load a template stored in a string via the `template_from_string` function (via the `TwingExtensionStringLoader` extension):

````javascript
{{ include(template_from_string("Hello {{ name }}")) }}
````

From JavaScript, it's also possible to load a template stored in a string via
`TwingEnvironment::createTemplate()`:

````javascript
    let template = twing.createTemplate('hello {{ name }}');
    console.log(template.render({'name': 'Fabien'}));
````

{% endraw %}

[back][back-url]

[back-url]: {{ site.baseurl }}{% link index.md %}
