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

let benchmarkOnce = async function (instance, data) {
    /** @var Twing.TwingEnvironment instance */
    let template = instance.load('index.html.twig');

    return await template.render(data);
};

let benchmark = async function (iterations) {
    console.warn('Benchmarking Twing');

    let instance = setup();
    let data = {
        data: ['some', 'bits', 'to', 'iterate', 'over']
    };

    // Prime the cache
    let result = await benchmarkOnce(instance, data);

    console.warn('Cache warmed', result);

    let start = process.hrtime();

    for (let i = 0; i < iterations; i++) {
        await benchmarkOnce(instance, data);
    }

    let diff = process.hrtime(start);

    diff = (diff[0] * NS_PER_SEC + diff[1]) / 1000000000;

    return diff;
};

fs.removeSync('tmp/benchmark');

let iterations = 100000;

benchmark(iterations).then(
    function (diff) {
        console.warn('Time taken: ' + diff);
        console.warn('Time taken per iteration: ' + diff / iterations);
    }
);
