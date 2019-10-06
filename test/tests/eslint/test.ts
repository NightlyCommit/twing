import * as tape from 'tape';
import path = require('path');

tape('eslint', (test) => {
    const CLIEngine = require("eslint").CLIEngine;
    const cli = new CLIEngine();
    const report = cli.executeOnFiles([path.join(path.resolve('.'),'src/**/*.ts')]);
    const formatter = cli.getFormatter();
    if(report.errorCount !== 0){
        test.fail(formatter(report.results))
    }else{
        test.pass('Passed ESLint tests');
    }
    test.end();
});