Introduction
============

This is the documentation for Twing, the TypeScript-written Node.js implementation of the [Twig Language][language-reference-url].

The key-features are...

* *Fast*: Twing compiles templates down to plain optimized JavaScript code. The overhead compared to regular JavaScript code was reduced to the very minimum.

* *Secure*: Twing has a sandbox mode to evaluate untrusted template code. This allows Twing to be used as a template language for applications where users
  may modify the template design.

* *Flexible*: Twing is powered by a flexible lexer and parser. This allows the developer to define their own custom tags and filters, and to create their own DSL.

## Prerequisites

Twing needs at least **node.js 6.0.0** to run but it is highly recommended to use **node.js 8.x** to enjoy the best performance possible.

## Installation

The recommended way to install Twing is via npm:

`npm i twing --save`

## Basic API Usage

This section gives you a brief introduction to the node.js API for Twing.

```js
const {TwingEnvironment, TwingLoaderArray} = require('twing');

let loader = new TwingLoaderArray({
    'index.twig': 'Hello {{ name }}!'
});
let twing = new TwingEnvironment(loader);

let output = twing.render('index.twig', {name: 'Fabien'});
```

Twing uses a loader (`TwingLoaderArray`) to locate templates, and an
environment (`TwingEnvironment`) to store the configuration.

The `render()` method loads the template passed as a first argument and
renders it with the variables passed as a second argument.

As templates are generally stored on the filesystem, Twing also comes with a
filesystem loader:

```js
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');

let loader = new TwingLoaderFilesystem('/path/to/templates');
let twing = new TwingEnvironment(loader);

let ouput = twing.render('index.html', {'name': 'Fabien'});
```
[back][back-url]

[back-url]: {{ site.baseurl }}{% link index.md %}
[language-reference-url]: {{ site.baseurl }}{% link language-reference/index.md %}
