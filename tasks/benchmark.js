const Benchmark = require('benchmark');

const path = require('path');
const suite = new Benchmark.Suite;

let indexSource = '{% include "include" %}';
let includeSource = '{{ foo }}';

const moduleAlias = require('module-alias');

moduleAlias.addAlias('twing/lib/runtime', path.resolve('./lib/runtime.js'));

let TwingEnvironment = require('../lib/twing/environment').TwingEnvironment;
let TwingLoaderArray = require('../lib/twing/loader/array').TwingLoaderArray;
let Twig = require('twig');

suite
    .add('twing', async function () {
        let loader = new TwingLoaderArray({
            index: indexSource,
            include: includeSource
        });

        let twing = new TwingEnvironment(loader);

        await twing.render('index', {foo: 'bar'});
    })
    .add('twig.js', async function () {
        Twig.cache(false);

        let template = Twig.twig({
            autoescape: true,
            data: indexSource,
            allowInlineIncludes: true
        });

        Twig.twig({
            autoescape: true,
            id: 'include',
            data: includeSource
        });

        await template.renderAsync({foo: 'bar'});
    })
    // add listeners
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async
    .run({'async': true})
;