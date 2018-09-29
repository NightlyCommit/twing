const finder = require('fs-finder');
const path = require('path');

let directory = path.resolve('test/tests/integration/fixtures');

let files = finder.from(directory).findFiles('test.js');

module.exports = files;