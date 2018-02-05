const parseFunction = require('parse-function');

let app  = parseFunction();

console.warn(app.parse(Math.abs));