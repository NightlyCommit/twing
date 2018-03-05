# Twing
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

First-class Twig engine for Node.js

## Philosophy behind Twing

We believe that a first-class Twig engine should be able to render any template to the exact same result as the official PHP engine. That means that it should implement 100% of the syntax defined by the language specifications and that it should render that syntax using PHP logic.

We also believe that a first-class Twig engine should be able to catch-up easily when Twig specifications evolve. Its code architecture and philosophy should then be as close as possible as the PHP implementation.

Finally, we believe that a first-class Twig engine should allow users to build on their experience with TwigPHP and get support from the huge community that comes with it.

That's what Twing is. A maintainability-first engine that pass 100% of the TwigPHP integration tests, is as close as possible to its code structure and expose an as-close-as-possible API.

## Prerequisites

Twing needs at least **node.js 7.6.0** to run.

## Installation

The recommended way to install Twing is via npm:

`npm i twing --save`

## Basic API Usage

```js
const Twing = require('twing');

let loader = new Twing.TwingLoaderArray({
    'index.twig': 'Hello {{ name }}!'
});
let twing = new Twing.TwingEnvironment(loader);

let output = await twing.render('index.twig', {name: 'Fabien'});
```

## More information

Read the [documentation](http://ericmorand.github.io/twing) for more information.

## Contributing

* Fork this repository
* Code
* Implement tests using [node-tap](https://github.com/tapjs/node-tap)
* Issue a pull request keeping in mind that all pull requests must reference an issue in the issue queue

## License

Copyright © 2018 [Eric MORAND](https://github.com/ericmorand). Released under the [2-Clause BSD License](https://github.com/ericmorand/twing/blob/master/LICENSE).

[npm-image]: https://badge.fury.io/js/twing.svg?v=0.8.1
[npm-url]: https://npmjs.org/package/twing
[travis-image]: https://travis-ci.org/ericmorand/twing.svg?branch=master&v=0.8.1
[travis-url]: https://travis-ci.org/ericmorand/twing
[daviddm-image]: https://david-dm.org/ericmorand/twing.svg?theme=shields.io&v=0.8.1
[daviddm-url]: https://david-dm.org/ericmorand/twing
[coveralls-image]: https://coveralls.io/repos/github/ericmorand/twing/badge.svg?v=0.8.1
[coveralls-url]: https://coveralls.io/github/ericmorand/twing
