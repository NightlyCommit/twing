Twing Internals
===============

{% raw %}

Twing is very extensible and you can easily hack it. Keep in mind that you should probably try to create an extension before hacking the core, as most features and enhancements can be handled with extensions. This chapter is also useful for people who want to understand how Twing works under the hood.

## How does Twing work?

The rendering of a Twig template can be summarized into four key steps:

* **Load** the template: If the template is already compiled, load it and go to the *evaluation* step, otherwise:

  * First, the **lexer** tokenizes the template source code into small pieces for easier processing;
  * Then, the **parser** converts the token stream into a meaningful tree of nodes (the Abstract Syntax Tree);
  * Eventually, the *compiler* transforms the AST into JavaScript code.

* **Evaluate** the template: It basically means calling the ``display()`` method of the compiled template and passing it the context.

## The Lexer

The lexer tokenizes a template source code into a token stream (each token is an instance of `TwingToken`, and the stream is an instance of `TwingTokenStream`). The default lexer recognizes 13 different token types:

* `TwingToken.BLOCK_START_TYPE`, `TwingToken.BLOCK_END_TYPE`: Delimiters for blocks (`{% %}`)
* `TwingToken.VAR_START_TYPE`, `TwingToken.VAR_END_TYPE`: Delimiters for variables (`{{ }}`)
* `TwingToken.TEXT_TYPE`: A text outside an expression;
* `TwingToken.NAME_TYPE`: A name in an expression;
* `TwingToken.NUMBER_TYPE`: A number in an expression;
* `TwingToken.STRING_TYPE`: A string in an expression;
* `TwingToken.OPERATOR_TYPE`: An operator;
* `TwingToken.PUNCTUATION_TYPE`: A punctuation sign;
* `TwingToken.INTERPOLATION_START_TYPE`, `TwingToken.INTERPOLATION_END_TYPE`: Delimiters for string interpolation;
* `TwingToken.EOF_TYPE`: Ends of template.

You can manually convert a source code into a token stream by calling the `tokenize()` method of an environment:

````javascript
let stream = twing.tokenize(new Twing.TwingSource(source, identifier));
````

As the stream has a `toString()` method, you can have a textual representation of it:

````javascript
console.log(stream.toString());
````

Here is the output for the `Hello {{ name }}` template:

````
TEXT_TYPE(Hello )
VAR_START_TYPE()
NAME_TYPE(name)
VAR_END_TYPE()
EOF_TYPE()
```` 

> The default lexer (`TwingLexer`) can be changed by calling the `setLexer()` method:

````javascript
twing.setLexer(lexer);
````

## The Parser

The parser converts the token stream into an AST (Abstract Syntax Tree), or a node tree (an instance of `TwingNodeModule`). The core extension defines the basic nodes like: `for`, `if`, ... and the expression nodes.

You can manually convert a token stream into a node tree by calling the `parse()` method of an environment:

````javascript
let nodes = twing.parse(stream);
````

Displaying the node object gives you a nice representation of the tree:

````javascript
console.warn(nodes);
````

Here is the output for the `Hello {{ name }}` template:

````
TwingNodeModule(index: null, embedded_templates: array ()
  body: TwingNodeBody(
          0: TwingNode(
               0: TwingNodeText(data: 'Hello ')
               1: TwingNodePrint(
                    expr: TwingNodeExpressionFilter(
                            node: TwingNodeExpressionName(name: 'name', is_defined_test: false, ignore_strict_check: false, always_defined: false)
                            filter: TwingNodeExpressionConstant(value: 'escape')
                            arguments: TwingNode(
                                         0: TwingNodeExpressionConstant(value: 'html')
                                         1: TwingNodeExpressionConstant(value: null)
                                         2: TwingNodeExpressionConstant(value: true)
                                       )
                          )
                  )
             )
        )
  blocks: TwingNode()
  macros: TwingNode()
  traits: TwingNode()
  display_start: TwingNode()
  display_end: TwingNode()
  constructor_start: TwingNode()
  constructor_end: TwingNode()
  class_end: TwingNode()
)

````

> The default parser (`TwingTokenParser`) can be changed by calling the `setParser()` method:

````javascript
twing.setParser(parser);
````

## The Compiler

The last step is done by the compiler. It takes a node tree as an input and generates JavaScript code usable for runtime execution of the template.

You can manually compile a node tree to JavaScript code with the `compile()` method of an environment:

````javascript
let javaScript = twing.compile(nodes);
````

The generated template for a `Hello {{ name }}` template reads as follows (the actual output can differ depending on the version of Twing you are using):

````javascript
const Twing = require('twing/lib/runtime');

module.exports = {};



/* Hello {{ name }} */
module.exports.__TwingTemplate_db681609e4f9c30158d1ad21d3956cdc61011a3e96df392a51446bcf6f35d06e = class __TwingTemplate_db681609e4f9c30158d1ad21d3956cdc61011a3e96df392a51446bcf6f35d06e extends Twing.TwingTemplate {
    constructor(env) {
        super(env);

        this.parent = false;

        this.blocks = new Twing.TwingMap([
        ]);
    }

    doDisplay(context, blocks = new Twing.TwingMap()) {
        // line 1
        Twing.echo("Hello ");
        Twing.echo(this.env.getFilter('escape').getCallable()(...[this.env, (context.has("name") ? context.get("name") : null), "html", null, true]));
    }

    getTemplateName() {
        return "Hello {{ name }}";
    }

    isTraitable() {
        return false;
    }

    getDebugInfo() {
        return new Map([[19,1]]);
    }

    getSourceContext() {
        return new Twing.TwingSource(``, "Hello {{ name }}", "");
    }
};

````

> The default compiler (`TwingCompiler`) can be changed by calling the `setCompiler()` method:

````javascript
twing.setCompiler(compiler);
````

{% endraw %}

[back][back-url]

[back-url]: {{ site.baseurl }}{% link index.md %}
