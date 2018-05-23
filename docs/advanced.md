Extending Twing
===============

{% raw %}

Twing can be extended in many ways; you can add extra tags, filters, tests, operators, global variables, and functions. You can even extend the parser itself with node visitors.

> The first section of this chapter describes how to extend Twing easily. If you want to reuse your changes in different projects or if you want to share them with others, you should then create an extension as described in the following section.

Before extending Twing, you must understand the differences between all the different possible extension points and when to use them.

First, remember that Twing has two main language constructs:

* `{{ }}`: used to print the result of an expression evaluation;

* `{% %}`: used to execute statements.

To understand why Twing exposes so many extension points, let's see how to implement a *Lorem ipsum* generator (it needs to know the number of words to generate).

You can use a `lipsum` *tag*:

```twig
{% lipsum 40 %}
```

That works, but using a tag for `lipsum` is not a good idea for at least three main reasons:

* `lipsum` is not a language construct;
* The tag outputs something;
* The tag is not flexible as you cannot use it in an expression:

```twig
{{ 'some text' ~ {% lipsum 40 %} ~ 'some more text' }}
```

In fact, you rarely need to create tags; and that's good news because tags are the most complex extension point of Twing.

Now, let's use a `lipsum` *filter*:

```twig
{{ 40|lipsum }}
```

Again, it works, but it looks weird. A filter transforms the passed value to something else but here we use the value to indicate the number of words to generate (so, `40` is an argument of the filter, not the value we want to transform).

Next, let's use a `lipsum` *function*:

```twig
{{ lipsum(40) }}
```

Here we go. For this specific example, the creation of a function is the extension point to use. And you can use it anywhere an expression is accepted:

```twig
{{ 'some text' ~ lipsum(40) ~ 'some more text' }}

{% set lipsum = lipsum(40) %}
```

Last but not the least, you can also use a *global* object with a method able to generate lorem ipsum text:

```twig
{{ text.lipsum(40) }}
```

As a rule of thumb, use functions for frequently used features and global objects for everything else.

Keep in mind the following when you want to extend Twing:

```
========== ========================== ========== =========================
What?      Implementation difficulty? How often? When?
========== ========================== ========== =========================
*macro*    trivial                    frequent   Content generation
*global*   trivial                    frequent   Helper object
*function* trivial                    frequent   Content generation
*filter*   trivial                    frequent   Value transformation
*tag*      complex                    rare       DSL language construct
*test*     trivial                    rare       Boolean decision
*operator* trivial                    rare       Values transformation
========== ========================== ========== =========================
```

Globals
-------

A global variable is like any other template variable, except that it's available in all templates and macros:

```javascript
let twing = new Twing.TwingEnvironment(loader);
twing.addGlobal('text', new Text());
```

You can then use the `text` variable anywhere in a template:

```twig
{{ text.lipsum(40) }}
```

Filters
-------

Creating a filter is as simple as associating a name with a JavaScript callable:

```javascript
let rot13 = require('rot13');

// an anonymous function
let filter = new TwingFilter('rot13', function (string) {
    return rot13(string);
});

// or a simple JavaScript function
filter = new Twing.TwingFilter('rot13', rot13);

// or a class static method
class Rot13Handler {
    static handle(string) {
        return rot13(string);
    }
}

filter = new Twing.TwingFilter('rot13', Rot13Handler.handle);

// or a class instance method
class Rot13Handler {
    handle(string) {
        return rot13(string);
    }
}

let handler = new Rot13Handler();

filter = new Twing.TwingFilter('rot13', handler.handle);

// the one below needs a runtime implementation (see below for more information)
filter = new Twing.TwingFilter('rot13', array('SomeClass', 'rot13Filter'));
```

The first argument passed to the `TwingFilter` constructor is the name of the filter you will use in templates and the second one is the JavaScript callable to associate with it.

Then, add the filter to your Twing environment:

```javascript
let twing = new Twing.TwingEnvironment(loader);
twing.addFilter(filter);
```

And here is how to use it in a template:

```twig
{{ 'Twing'|rot13 }}

{# will output Gjvat #}
```

When called by Twing, the JavaScript callable receives the left side of the filter (before the pipe `|`) as the first argument and the extra arguments passed to the filter (within parentheses `()`) as extra arguments.

For instance, the following code:

```twig
{{ 'Twing'|lower }}
{{ now|date('d/m/Y') }}
```

is compiled to something like the following:

```javascript
Twing.echo('Twing'.toLowerCase);
Twing.echo(twing_date_format_filter(new Date(), 'd/m/Y'));
```

The `TwingFilter` class takes an array of options as its last argument:

```javascript
    let filter = new Twing.TwingFilter('rot13', rot13, options);
```

### Environment-aware Filters

If you want to access the current environment instance in your filter, set the `needs_environment` option to `true`. Twing will pass the current environment as the first argument to the filter call:

```javascript
let filter = new Twing.TwingFilter('rot13', function (env, string) {
    // get the current charset for instance
    let charset = env.getCharset();

    return rot13(string);
}, {needs_environment: true});
```

### Context-aware Filters

If you want to access the current context in your filter, set the `needs_context` option to `true`. Twing will pass the current context as the first argument to the filter call (or the second one if `needs_environment` is also set to `true`):

```javascript
let filter = new Twing.TwingFilter('rot13', function (context, string) {
    // ...
}, {needs_context: true});

let filter = new Twing.TwingFilter('rot13', function (env, context, string) {
    // ...
}, {needs_context: true, needs_environment: true});
```

### Automatic Escaping

If automatic escaping is enabled, the output of the filter may be escaped before printing. If your filter acts as an escaper (or explicitly outputs HTML or JavaScript code), you will want the raw output to be printed. In such a case, set the `is_safe` option:

```javascript
let filter = new Twing.TwingFilter('nl2br', nl2br, {is_safe: ['html']});
```

Some filters may need to work on input that is already escaped or safe, for example when adding (safe) HTML tags to originally unsafe output. In such a case, set the ``pre_escape`` option to escape the input data before it is run through your filter:

```javascript
let filter = new Twing.TwingFilter('somefilter', somefilter, {pre_escape: 'html', is_safe: ['html']});
```

### Variadic Filters

When a filter should accept an arbitrary number of arguments, set the `is_variadic` option to `true`. Twing will pass the extra arguments as the last argument to the filter call as an array:

```javascript
let filter = new Twing.TwingFilter('thumbnail', function (file, options = []) {
    // ...
}, {is_variadic: true});
```

Be warned that named arguments passed to a variadic filter cannot be checked for validity as they will automatically end up in the option array.

### Dynamic Filters

A filter name containing the special `*` character is a dynamic filter as the `*` can be any string:

```javascript
let filter = new TwingFilter('*_path', function (name, arguments) {
    // ...
});
```

The following filters will be matched by the above defined dynamic filter:

* `product_path`
* `category_path`

A dynamic filter can define more than one dynamic parts:

```javascript
let filter = new TwingFilter('*_path_*', function (name, suffix, arguments) {
    // ...
});
```

The filter will receive all dynamic part values before the normal filter arguments, but after the environment and the context. For instance, a call to `'foo'|a_path_b()` will result in the following arguments to be passed to the filter: `('a', 'b', 'foo')`.

### Deprecated Filters

You can mark a filter as being deprecated by setting the `deprecated` option to `true`. You can also give an alternative filter that replaces the deprecated one when that makes sense:

```javascript
let filter = new TwingFilter('obsolete', function () {
    // ...
}, {deprecated: true, alternative: 'new_one'});
```

When a filter is deprecated, Twing emits a deprecation warning when compiling a template using it. See [deprecation-warnings][deprecation-warnings-url] for more information.

### Functions

Functions are defined in the exact same way as filters, but you need to create an instance of `TwingFunction`:

```javascript
let twing = new Twing.TwingEnvironment(loader);
let function = new Twing.TwingFunction('function_name', function () {
    // ...
});
twing.addFunction(function);
```

Functions support the same features as filters, except for the `pre_escape` and `preserves_safety` options.

### Tests

Tests are defined in the exact same way as filters and functions, but you need to create an instance of `TwingTest`:

```javascript
let twing = new Twing.TwingEnvironment(loader);
let test = new Twing.TwingTest('test_name', function () {
    // ...
});
twing.addTest(test);
```

Tests allow you to create custom application specific logic for evaluating boolean conditions. As a simple example, let's create a Twing test that checks if objects are 'red':

```javascript
let twing = new Twing.TwingEnvironment(loader);
let test = new Twing.TwingTest('red', function (value) {
    if (value.color && value.color === 'red') {
        return true;
    }
    if (value.paint && value.paint === 'red') {
        return true;
    }
    return false;
});
twing.addTest(test);
```

Test functions should always return true/false.

When creating tests you can use the `node_factory` option to provide custom test compilation. This is useful if your test can be compiled into JavaScript primitives. This is used by many of the tests built into Twing:

```javascript
class TwingNodeExpressionTestOdd extends Twing.TwingNodeExpressionTest {
    compile(compiler) {
        compiler
            .raw('(')
            .subcompile(this.getNode('node'))
            .raw(' % 2 === 1')
            .raw(')')
        ;
    }
}

let twing = new Twing.TwingEnvironment(loader);
let test = new Twing.TwingTest('odd', null, {
    node_factory: function (node, name, nodeArguments, lineno) {
        return new TwingNodeExpressionTestOdd(node, name, nodeArguments, lineno);
    }
});
twing.addTest(test);

```

The above example shows how you can create tests that use a node class. The node class has access to one sub-node called 'node'. This sub-node contains the value that is being tested. When the `odd` filter is used in code such as:

```twig
{% if my_value is odd %}
```

The `node` sub-node will contain an expression of `my_value`. Node-based tests also have access to the `arguments` node. This node will contain the various other arguments that have been provided to your test.

If you want to pass a variable number of positional or named arguments to the test, set the `is_variadic` option to `true`. Tests also support dynamic name feature as filters and functions.

### Tags

One of the most exciting features of a template engine like Twig is the possibility to define new language constructs. This is also the most complex feature as you need to understand how Twing's internals work.

Let's create a simple `set` tag that allows the definition of simple variables from within a template. The tag can be used like follows:

```twig
{% set name = "value" %}

{{ name }}

{# should output value #}
```

> The `set` tag is part of the Core extension and as such is always available. The built-in version is slightly more powerful and supports multiple assignments by default (cf. the template designers chapter for more information).

Three steps are needed to define a new tag:

* Defining a Token Parser class (responsible for parsing the template code);

* Defining a Node class (responsible for converting the parsed code to JavaScript);

* Registering the tag.

### Registering a new tag

Adding a tag is as simple as calling the `addTokenParser` method on the `TwingEnvironment` instance:

```javascript
let twing = new Twing.TwingEnvironment(loader);
twing.addTokenParser(new ProjectSetTokenParser());
```

### Defining a Token Parser

Now, let's see the actual code of this class:

```javascript
class ProjectSetTokenParser extends Twing.TwingTokenParser {
    parse(token) {
        let parser = this.parser;
        let stream = parser.getStream();

        let name = stream.expect(Twing.TwingToken.NAME_TYPE).getValue();
        stream.expect(Twing.TwingToken.OPERATOR_TYPE, '=');
        let value = parser.getExpressionParser().parseExpression();
        stream.expect(Twing.TwingToken.BLOCK_END_TYPE);

        return new ProjectSetNode(name, value, token.getLine(), this.getTag());
    }

    getTag() {
        return 'set';
    }
}
```

The `getTag()` method must return the tag we want to parse, here `set`.

The `parse()` method is invoked whenever the parser encounters a `set` tag. It should return a `TwingNode` instance that represents the node (the `ProjectSetNode` calls creating is explained in the next section).

The parsing process is simplified thanks to a bunch of methods you can call from the token stream (`this.parser.getStream()`):

* `getCurrent()`: Gets the current token in the stream.

* `next()`: Moves to the next token in the stream, *but returns the old one*.

* `test(type)`, `test(value)` or `test(type, value)`: Determines whether the current token is of a particular type or value (or both). The value may be an array of several possible values.

* `expect(type[, value[, message]])`: If the current token isn't of the given type/value a syntax error is thrown. Otherwise, if the type and value are correct, the token is returned and the stream moves to the next token.

* `look()`: Looks at the next token without consuming it.

Parsing expressions is done by calling the `parseExpression()` like we did for the `set` tag.

> Reading the existing `TokenParser` classes is the best way to learn all the nitty-gritty details of the parsing process.

### Defining a Node

The `ProjectSetNode` class itself is rather simple:

```javascript
class ProjectSetNode extends Twing.TwingNode {
    constructor(name, value, line, tag = null) {
        super(new Twing.TwingMap([['value', value]]), new TwingMap([['name': name]]), line, tag);
    }

    compile(compiler) {
        compiler
            .addDebugInfo(this)
            .write('context.set(\'' + this.getAttribute('name') + '\', ')
            .subcompile(this.getNode('value'))
            .raw(");\n")
        ;
    }
}
```

The compiler implements a fluid interface and provides methods that helps the developer generate beautiful and readable JavaScript code:

* `subcompile()`: Compiles a node.

* `raw()`: Writes the given string as is.

* `write()`: Writes the given string by adding indentation at the beginning of each line.

* `string()`: Writes a quoted string.

* `repr()`: Writes a JavaScript representation of a given value (see `TwingNodeFor` for a usage example).

* `addDebugInfo()`: Adds the line of the original template file related to the current node as a comment.

* `indent()`: Indents the generated code (see `TwingNodeBlock` for a usage example).

* `outdent()`: Outdents the generated code (see `TwingNodeBlock` for a usage example).

## Creating an Extension

The main motivation for writing an extension is to move often used code into a reusable class like adding support for internationalization. An extension can define tags, filters, tests, operators, global variables, functions, and node visitors.

Most of the time, it is useful to create a single extension for your project, to host all the specific tags and filters you want to add to Twing.

An extension is a class that implements the following TypeScript interface:

```typescript
interface TwingExtensionInterface {
    /**
     * Returns the token parser instances to add to the existing list.
     *
     * @return Array<TwingTokenParserInterface>
     */
    getTokenParsers(): Array<TwingTokenParserInterface>;

    /**
     * Returns the node visitor instances to add to the existing list.
     *
     * @return Array<TwingNodeVisitorInterface>
     */
    getNodeVisitors(): Array<TwingNodeVisitorInterface>;

    /**
     * Returns a list of filters to add to the existing list.
     *
     * @return Array<TwingFilter>
     */
    getFilters(): Array<TwingFilter>;

    /**
     * Returns a list of tests to add to the existing list.
     *
     * @returns Array<TwingTest>
     */
    getTests(): Array<TwingTest>;

    /**
     * Returns a list of functions to add to the existing list.
     *
     * @return Array<TwingFunction>
     */
    getFunctions(): Array<TwingFunction>;

    /**
     * Returns a list of operators to add to the existing list.
     *
     * @return array<Map<string, TwingOperatorDefinitionInterface>> First array of unary operators, second array of binary operators
     */
    getOperators(): { unary: Map<string, TwingOperatorDefinitionInterface>, binary: Map<string, TwingOperatorDefinitionInterface> };

    /**
     * Gets the default strategy to use when not defined by the user.
     *
     * @param {string} name The template name
     *
     * @returns string|Function The default strategy to use for the template
     */
    getDefaultStrategy(name: string): string | Function | false;
}
```

To keep your extension class clean and lean, inherit from the built-in `TwingExtension` class instead of implementing the interface as it provides empty implementations for all methods:

```
class ProjectTwingExtension extends Twing.TwingExtension {
}
```

Of course, this extension does nothing for now. We will customize it in the next sections.

All extensions must be registered explicitly to be available in your templates.

You can register an extension by using the `addExtension()` method on your main `TwingEnvironment` object:

```
let twing = new Twing.TwingEnvironment(loader);
twing.addExtension(new ProjectTwingExtension());
```

> The Twing core extensions are great examples of how extensions work.

### Globals

Global variables can be registered in an extension via the `getGlobals()` method:

```
class ProjectTwingExtension extends Twing.TwingExtension {
    getGlobals() {
        return new TwingMap([
            ['text': new Text()],
        ]);
    }

    // ...
}
```

### Functions

Functions can be registered in an extension via the `getFunctions()` method:

```javascript
class ProjectTwingExtension extends Twing.TwingExtension {
    getFunctions() {
        return [
            new Twing.TwingFunction('lipsum', generate_lipsum),
        ];
    }

    // ...
}
```

### Filters

To add a filter to an extension, you need to override the `getFilters()` method. This method must return an array of filters to add to the Twing environment:

```javascript
class ProjectTwingExtension extends Twing.TwingExtension {
    getFilters() {
        return [
            new Twing.TwingFilter('rot13', rot13),
        ];
    }

    // ...
}
```

### Tags

Adding a tag in an extension can be done by overriding the `getTokenParsers()` method. This method must return an array of tags to add to the Twing environment:

```javascript
class ProjectTwingExtension extends Twing.TwingExtension {
    getTokenParsers() {
        return [new ProjectSetTokenParser()];
    }

    // ...
}
```

In the above code, we have added a single new tag, defined by the `ProjectSetTokenParser` class. The `ProjectSetTokenParser` class is responsible for parsing the tag and compiling it to JavaScript.

### Operators

The `getOperators()` methods lets you add new operators. Here is how to add `!`, `||`, and `&&` operators:

```javascript
class ProjectTwingExtension extends Twing.TwingExtension {
    getOperators() {
        return [
            new Map([
                ['!', {
                    precedence: 50,
                    factory: function (expr, lineno) {
                        return new Twing.TwingNodeExpressionUnaryNot(expr, lineno);
                    }
                }]
            ]),
            new Map([
                ['||', {
                    precedence: 10,
                    factory: function (expr, lineno) {
                        return new Twing.TwingNodeExpressionBinaryOr(expr, lineno);
                    },
                    associativity: Twing.TwingExpressionParser.OPERATOR_LEFT
                }],
                ['&&', {
                    precedence: 15,
                    factory: function (expr, lineno) {
                        return new Twing.TwingNodeExpressionBinaryAnd(expr, lineno);
                    },
                    associativity: Twing.TwingExpressionParser.OPERATOR_LEFT
                }]
            ])
        ];
    }

    // ...
}
```

### Tests

The `getTests()` method lets you add new test functions:

```javascript
class ProjectTwingExtension extends TwingExtension {
    getTests() {
        return [
            new Twing.TwingTest('even', twing_test_even),
        ];
    }

    // ...
}
```

### Definition vs Runtime

Twing filters, functions, and tests runtime implementations can be defined as any valid JavaScript callable:

* **local functions**: Simple to implement and fast (used by all Twing core extensions); but it is hard for the runtime to depend on external objects;

* **anonymous functions**: Simple to implement;

* **object methods**: More flexible and required if your runtime code depends on external objects.

The simplest way to use methods is to define them on the extension itself:

```javascript
class ProjectTwingExtension extends Twing.Twing_Extension {
    constructor(rot13Provider) {
        this.rot13Provider = rot13Provider;
    }

    getFunctions() {
        return [
            new TwingFunction('rot13', this.rot13)),
        ];
    }

    rot13($value) {
        return this.rot13Provider.rot13($value);
    }
}
```

This is very convenient but not recommended as it makes template compilation depend on runtime dependencies even if they are not needed (think for instance
as a dependency that connects to a database engine).

You can easily decouple the extension definitions from their runtime implementations by registering a `TwingRuntimeLoaderInterface` instance on the environment that knows how to instantiate such runtime classes:

```javascript
class RuntimeLoader {
    load(className) {
        // implement the logic to create an instance of className and inject its dependencies
        if (className === 'ProjectTwingRuntimeExtension') {
            return new ProjectTwingRuntimeExtension(new Rot13Provider());
        } 
        else {
            // ...
        }
    }
}

twing.addRuntimeLoader(new RuntimeLoader());
```

It is now possible to move the runtime logic to a new `ProjectTwingRuntimeExtension` class and use it directly in the extension:

```javascript
class ProjectTwingRuntimeExtension
{
    constructor(rot13Provider) {
        this.rot13Provider = rot13Provider;
    }

    rot13($value) {
        return this.rot13Provider.rot13($value);
    }
}

class ProjectTwingExtension extends Twing.Twing_Extension {
    getFunctions() {
        return [
            new Twing.TwingFunction('rot13', ['ProjectTwingRuntimeExtension', 'rot13']),
            // or
            new Twing.TwingFunction('rot13', 'ProjectTwingRuntimeExtension::rot13'),
        );
    }
}
```

### Overloading

To overload an already defined filter, test, operator, global variable, or function, re-define it in an extension and register it **as late as possible** (order matters):

```javascript
class MyCoreExtension extends Twing.TwingExtension {
    getFilters() {
        return [
            new Twing.TwingFilter('date', this.dateFilter),
        ];
    }

    dateFilter(timestamp, format = 'F j, Y H:i') {
        // do something different from the built-in date filter
    }
}

let twing = new Twing.TwingEnvironment(loader);
twing.addExtension(new MyCoreExtension());
```

Here, we have overloaded the built-in `date` filter with a custom one.

If you do the same on the `TwingEnvironment` itself, beware that it takes precedence over any other registered extensions:

```javascript
let twing = new Twing.TwingEnvironment(loader);
twing.addFilter(new Twing.TwingFilter('date', function (timestamp, $format = 'F j, Y H:i') {
    // do something different from the built-in date filter
}));
// the date filter will come from the above registration, not
// from the registered extension below
twing.addExtension(new MyCoreExtension());
```

> Note that overloading the built-in Twing elements is not recommended as it might be confusing.

{% endraw %}

[back][back-url]

[back-url]: {{ site.baseurl }}{% link index.md %}
[deprecation-warnings-url]: {{ site.baseurl }}{% link recipes.md %}#deprecation-warnings