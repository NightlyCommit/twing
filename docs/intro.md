Introduction
============

This is the documentation for Twing, the TypeScript-written Node.js implementation of the [Twig Language][language-reference-url].

The key-features are...

* *Fast*: Twing compiles templates down to plain optimized JavaScript code. The overhead compared to regular JavaScript code was reduced to the very minimum.

* *Secure*: Twing has a sandbox mode to evaluate untrusted template code. This allows Twing to be used as a template language for applications where users
  may modify the template design.

* *Flexible*: Twing is powered by a flexible lexer and parser. This allows the developer to define their own custom tags and filters, and to create their own DSL.

## Prerequisites

Twing needs at least **node.js 7.6.0** to run.

## Installation

The recommended way to install Twing is via npm:

`npm i twing --save`

## Basic API Usage

This section gives you a brief introduction to the node.js API for Twing.

```js
const Twing = require('twing');

let loader = new Twing.TwingLoaderArray({
    'index.twig': 'Hello {{ name }}!'
});
let twing = new Twing.TwingEnvironment(loader);

let output = await twing.render('index.twig', {name: 'Fabien'});
```

Twing uses a loader (`TwingLoaderArray`) to locate templates, and an
environment (`TwingEnvironment`) to store the configuration.

The `render()` method loads the template passed as a first argument and
renders it with the variables passed as a second argument.

As templates are generally stored on the filesystem, Twing also comes with a
filesystem loader:

```js
const Twing = require('twing');

let loader = new Twing.TwingLoaderFilesystem('/path/to/templates');
let twing = new Twing.TwingEnvironment(loader);

let ouput = await twing.render('index.html', {'name': 'Fabien'});
```

## Asynchronous by nature

Twing is asynchronous by nature. It means that `TwingEnvironment::render`,`TwingEnvironment::display` and the belonging `TwingTemplate` functions return a Promise. This asynchronous nature makes possible to implement asynchronous filters, functions and tests.

```js
class SleepExtenstion extends Twing.TwingExtension {
    getFunctions() {
        return [
            new Twing.TwingFunction('sleep', function(duration) {
                return new Promise((resolve) => setTimeout(resolve, duration));      
            })
        ];
    }
}
```
[back][back-url]

[back-url]: {{ site.baseurl }}{% link index.md %}
[language-reference-url]: {{ site.baseurl }}{% link language-reference/index.md %}
