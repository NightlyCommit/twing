const fs = require('fs');
const path = require('path');
const pkg = require('../package');

let version = pkg.version;
let readmePath = path.resolve('README.md');

let readmeData = fs.readFileSync(readmePath).toString();

readmeData = readmeData.replace(new RegExp(`v=${version}`, 'gi'), 'v=__VERSION__');

fs.writeFileSync(readmePath, readmeData);
