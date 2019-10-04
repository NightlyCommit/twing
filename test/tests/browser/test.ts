const {resolve, relative} = require('path');
const {Readable} = require('stream');
const finder = require('fs-finder');

let directory = resolve('test/tests/browser/dist/test/tests/integration/fixtures');

let files = finder.from(directory).findFiles('*.js');

let data: string[] = [
    `const {TwingEnvironmentBrowser} = require('./test/tests/browser/dist/src/lib/environment/browser.js');`
];

for (let file of files) {
    data.push(`(() => {
    let module = require('${file}');

    for (let key in module) {
        let Test = module[key];

        new Test(TwingEnvironmentBrowser, '${relative(directory, file)}').run();
    }
})();
`);
}

const stream = new Readable();

stream.push(data.join('\n'));
stream.push(null);
stream.pipe(process.stdout);
