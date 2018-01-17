const rollup = require('rollup');
const rollupPluginTypescript = require('rollup-plugin-typescript2');
const rollupPluginMultiEntry = require('rollup-plugin-multi-entry');
const fs = require('fs-extra');
const path = require('path');

const outputDir = path.resolve('build/node');

const outputOpts = {
    file: path.join(outputDir, 'twing.js'),
    format: 'cjs'
};

fs.emptyDir(outputDir).then(
    function() {
        rollup.rollup({
            input: 'src/**/*.ts',
            plugins: [
                rollupPluginMultiEntry(),
                rollupPluginTypescript({
                    typescript: require('typescript')
                })
            ]
        }).then(
            function (bundle) {
                bundle.write(outputOpts);
            },
            function (error) {
                console.error(error);
            }
        );
    }
);

