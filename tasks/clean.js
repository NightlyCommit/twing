const fs = require('fs-extra');
const path = require('path');

const outputDir = path.resolve('lib');

fs.emptyDirSync(outputDir);

