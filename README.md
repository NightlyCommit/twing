# Twing
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![Donate][donate-image]][donate-url]

First-class Twig engine for Node.js

## Philosophy behind Twing

We believe that a first-class Twig engine should be able to render any template to the exact same result as the official PHP engine. That means that it should implement 100% of the syntax defined by the language specifications and that it should render that syntax using PHP logic.

We also believe that a first-class Twig engine should be able to catch-up easily when Twig specifications evolve. Its code architecture and philosophy should then be as close as possible as the PHP implementation.

Finally, we believe that a first-class Twig engine should allow users to build on their experience with TwigPHP and get support from the huge community that comes with it.

That's what Twing is. A maintainability-first engine that pass 100% of the TwigPHP integration tests, is as close as possible to its code structure and expose an as-close-as-possible API.

## Prerequisites

Twing needs at least **node.js 6.0.0** to run but it is highly recommended to use **node.js 8.x** or higher to enjoy the best performance possible.

## Installation

The recommended way to install Twing is via npm:

`npm install twing --save`

## Basic API Usage

```js
const {TwingEnvironment, TwingLoaderArray} = require('twing');

let loader = new TwingLoaderArray({
    'index.twig': 'Hello {{ name }}!'
});
let twing = new TwingEnvironment(loader);

let output = twing.render('index.twig', {name: 'Fabien'});
```

## Usage with Express

Twing and Express work quite well together. Have a look at the [documentation](http://ericmorand.github.io/twing/intro.html#real-world-example-using-express) for an example of usage with Express.

## Browser support

Starting with version 2.0.0, Twing can be used in web browsers with very few compromise. Filesystem components are obviously not available (namely filesystem loader and cache) but everything else is fully supported.

### Module bundler

Module bundlers will automatically grab the browser-specific flavor of Twing when Twing module is imported. Either `const {TwingEnvironment} = require('twing');` or `import {TwingEnvironment} from 'twing';` will work in both node.js and the browser - once bundled in the latter case.

### Script tag

Use [jsdelivr](https://www.jsdelivr.com/) CDN to include Twing in your HTML document:

`<script src="https://cdn.jsdelivr.net/npm/twing/dist/lib.min.js"></script>`

Once loaded by the browser, Twing is available under the global `Twing` variable.

## Known issues

You can find the list of known issues of Twing regarding Twig specifications implementation [here](http://ericmorand.github.io/twing/known_issues).

## More information

Read the [documentation](http://ericmorand.github.io/twing) for more information.

## Contributing

* Fork this repository
* Code
* Implement tests using [tape](https://github.com/substack/tape)
* Issue a pull request keeping in mind that all pull requests must reference an issue in the issue queue

## License

Copyright © 2018 [Eric MORAND](https://github.com/ericmorand). Released under the [2-Clause BSD License](https://github.com/ericmorand/twing/blob/master/LICENSE).

[npm-image]: https://badge.fury.io/js/twing.svg
[npm-url]: https://npmjs.org/package/twing
[travis-image]: https://travis-ci.org/ericmorand/twing.svg?branch=master
[travis-url]: https://travis-ci.org/ericmorand/twing
[coveralls-image]: https://coveralls.io/repos/github/ericmorand/twing/badge.svg
[coveralls-url]: https://coveralls.io/github/ericmorand/twing
[donate-image]: https://img.shields.io/badge/Donate-PayPal-green.svg
[donate-url]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7YZU3L2JL2KJA
