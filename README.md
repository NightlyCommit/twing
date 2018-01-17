# Twing
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

First-class Twig engine for Node.js

## Philosophy behind Twing

We believe that a first-class Twig engine should be able to render any template to the exact same result as the official PHP engine. That means that it should implement 100% of the syntax defined by the language specifications and that it should render that syntax using PHP logic.

We also believe that a first-class Twig engine should be able to catch-up easily when Twig specifications evolve. Its code architecture and philosophy should then be as close as possible as the PHP implementation.

Finally, we believe that a first-class Twig engine should allow users to build on their experience with TwigPHP and get support from the huge community that comes with it.

That's what Twing is. A maintainability-first engine that pass 100% of the TwigPHP integration tests, is as close as possible to its code structure and expose an as-close-as-possible API.

## Prerequisites

Twing needs at least **node.js 6.0.0** to run.

## Installation

The recommended way to install Twing is via npm:

`npm i twing --save`

## Basic API Usage

This section gives you a brief introduction to the node.js API for Twing.

    const Twing = require('twing');
    
    let loader = new Twing.TwingLoaderArray(new Map([
        ['index.twig', 'Hello {{ name }}!']
    ]))
    let twing = new Twing.TwingEnvironment(loader);
    let output = twing.render('index.twig', {name: 'Fabien'});

Twing uses a loader (`TwingLoaderArray`) to locate templates, and an
environment (`TwingEnvironment`) to store the configuration.

The `render()` method loads the template passed as a first argument and
renders it with the variables passed as a second argument.

As templates are generally stored on the filesystem, Twing also comes with a
filesystem loader:

    const Twing = require('twing');

    let loader = new Twing.TwingLoaderFilesystem('/path/to/templates');
    let twing = new Twing.TwingEnvironment(loader);

    console.log(twing.render('index.html', {'name': 'Fabien'}));

[npm-image]: https://badge.fury.io/js/twing.svg
[npm-url]: https://npmjs.org/package/twing
[travis-image]: https://travis-ci.org/ericmorand/twing.svg?branch=master
[travis-url]: https://travis-ci.org/ericmorand/twing
[daviddm-image]: https://david-dm.org/ericmorand/twing.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ericmorand/twing
[coveralls-image]: https://coveralls.io/repos/github/ericmorand/twing/badge.svg
[coveralls-url]: https://coveralls.io/github/ericmorand/twing
