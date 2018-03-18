const path = require('path');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing/lib/runtime', path.resolve('./lib/runtime.js'));

const Twing = require('../lib/twing');
const fs = require('fs-extra');

const NS_PER_SEC = 1e9;

let setup = function () {
    let loader = new Twing.TwingLoaderFilesystem('benchmark/templates');

    return new Twing.TwingEnvironment(loader, {
        cache: 'tmp/benchmark',
        auto_reload: false,
        autoescape: 'html'
    })
};

let benchmarkOnce = function (instance, data) {
    /** @var Twing.TwingEnvironment instance */
    let template = instance.load('index.html.twig');

    return template.render(data);
};

let benchmark = function (iterations) {
    console.warn('Benchmarking Twing');

    let instance = setup();
    let data = {
        data: ['some', 'bits', 'to', 'iterate', 'over']
    };

    // Prime the cache
    let renderResult = benchmarkOnce(instance, data);
    console.warn('Cache warmed', renderResult);

    let start = process.hrtime();

    for (let i = 0; i < iterations; i++) {
        benchmarkOnce(instance, data);
    }

    let diff = process.hrtime(start);

    let duration = diff[0] * NS_PER_SEC + diff[1];

    return duration;
};

fs.removeSync('tmp/benchmark');

let iterations = 100000;

let duration = benchmark(iterations);

duration /= 1000000000; // s

console.warn('Time taken: ' + duration);
console.warn('Time taken per iteration: ' + duration / iterations);
