const path = require('path');
const {Readable} = require('stream');

let fixtures = require('./fixtures');

let data = `const {TwingEnvironmentBrowser} = require('../dist/cjs/lib/environment/browser');

let testCases = [
`;

for (let fixture of fixtures) {
    let fixturePath = path.relative(path.resolve('./test'), path.dirname(fixture));

    data += `    new (require('./${fixturePath}/test'))(),\n`;
}

data += `];

for (let testCase of testCases) {
    testCase.run(TwingEnvironmentBrowser);
}
`;

const stream = new Readable();

stream.push(data);
stream.push(null);
stream.pipe(process.stdout);
