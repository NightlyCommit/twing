# Twing
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![Donate][donate-image]][donate-url]

First-class Twig engine for Node.js

## Philosophy behind Twing

We believe that a first-class Twig engine should be able to render any template to the exact same result as the official PHP engine. That means that it should implement 100% of the syntax defined by the language specifications and that it should render that syntax using PHP logic.

We also believe that a first-class Twig engine should be able to catch-up easily when Twig specifications evolve. Its code architecture and philosophy should then be as close as possible as the PHP implementation.

Finally, we believe that a first-class Twig engine should allow users to build on their experience with TwigPHP and get support from the huge community that comes with it.

That's what Twing is. A maintainability-first engine that pass 100% of the TwigPHP integration tests, is as close as possible to its code structure and expose an as-close-as-possible API.

## Prerequisites

Twing needs at least **node.js 8.0.0** to run.

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

twing.render('index.twig', {name: 'Fabien'}).then((output) => {
    // do something with the output
});
```

## Usage with Express

Twing and Express work quite well together. Have a look at the [documentation](http://NightlyCommit.github.io/twing/intro.html#real-world-example-using-express) for an example of usage with Express.

## Browser support

Starting with version 2.0.0, Twing can be used in web browsers with very few compromise. Filesystem components are obviously not available (namely filesystem loader and cache) but everything else is fully supported.

### Module bundler

Module bundlers will automatically grab the browser-specific flavor of Twing when Twing module is imported. Either `const {TwingEnvironment} = require('twing');` or `import {TwingEnvironment} from 'twing';` will work in both node.js and the browser - once bundled in the latter case.

### Script tag

Use [jsdelivr](https://www.jsdelivr.com/) CDN to include Twing in your HTML document:

`<script src="https://cdn.jsdelivr.net/npm/twing/dist/lib.min.js"></script>`

Once loaded by the browser, Twing is available under the global `Twing` variable.

## Twig specifications implementation

Twing aims at implementing Twig specifications perfectly, without compromise. This is not an easy task due to the nature of Twig specifications: they don't exist officially and can only be deduced from the public documentation, the source code documentation and the test suite of the PHP reference implementation. It sometimes happens that something that was not part of either the documentations or the test suite suddenly becomes part of the specifications like the [`filter` tag](https://github.com/twigphp/Twig/issues/3091) or the [macros rework](https://github.com/twigphp/Twig/issues/3090) issues, putting Twing and all other non-reference implementations in the uncomfortable position of having to deal with a potential breaking change. Since Twig's team doesn't plan on releasing some official specifications for the language, we can't expect the problem to be solved anytime soon.

Twing's strategy here is to stick strictly to Semantic Versioning rules and *never* introduce a breaking change into a minor version - its extensive test suite with 100% code coverage guarantees that. Twig teams's mistakes will be managed by either issuing a [known issue](#known-issues), if the mistake is trivial, or bumping to a new major version, if it is not.

### Compatibility chart

Here is the compatibility chart between minor versions of Twing and Twig specifications levels, along with a summary of notable features provided by each Twig specifications level. Note that Twig minor versions don't always provide new language-related features (because of Twig's team perpetuating the confusion between Twig and their reference implementation, TwigPHP).

|Twing version|Twig specifications level|Notable features|
|:---:|:---:|---|
|3.0|2.11|[Macros scoping](https://twig.symfony.com/doc/2.x/tags/macro.html#macros-scoping)|
|2.3|2.10|`spaceless`, `column`, `filter`, `map` and `reduce` filters, `apply` tag, `line whitespace trimming` whitespace control modifier|
|2.2|2.6|`deprecated` tag|
|1.3|2.5|`spaceless` and `block`-related deprecations|
|1.0|2.4|   |

It is highly recommended to always use the latest version of Twing available as bug fixes will always target the latest version.

### Known issues

You can find the list of known issues of Twing regarding Twig specifications implementation [here](http://NightlyCommit.github.io/twing/known_issues). Note that known issues are guaranteed to be addressed in the next major version bump of Twing.

## More information

Read the [documentation](http://NightlyCommit.github.io/twing) for more information.

## Related projects

* [gulp-twing](https://www.npmjs.com/package/gulp-twing): Compile Twig templates with gulp. Build upon Twing.
* [twing-loader](https://www.npmjs.com/package/twing-loader): Webpack loader that compiles Twig templates using Twing.

## Contributing

* Fork this repository
* Code
* Implement tests using [tape](https://github.com/substack/tape)
* Issue a pull request keeping in mind that all pull requests must reference an issue in the issue queue

## License

Copyright © 2018 [Eric MORAND](https://github.com/ericmorand). Released under the [2-Clause BSD License](https://github.com/ericmorand/twing/blob/master/LICENSE).

[npm-image]: https://badge.fury.io/js/twing.svg
[npm-url]: https://npmjs.org/package/twing
[travis-image]: https://travis-ci.com/NightlyCommit/twing.svg?branch=master
[travis-url]: https://travis-ci.com/NightlyCommit/twing
[coveralls-image]: https://coveralls.io/repos/github/NightlyCommit/twing/badge.svg
[coveralls-url]: https://coveralls.io/github/NightlyCommit/twing
[donate-image]: https://img.shields.io/badge/Donate-PayPal-green.svg
[donate-url]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7YZU3L2JL2KJA
