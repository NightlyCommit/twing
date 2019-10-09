import * as tape from "tape";
import {resolve} from "path";

tape('code quality', (test) => {
    test.test('linting', (test) => {
        const {CLIEngine} = require("eslint");
        const cli = new CLIEngine();
        const report = cli.executeOnFiles([
            resolve('src/**/*.ts'),
            resolve('test/**/*.ts')
        ]);
        const formatter = cli.getFormatter();

        test.same(report.errorCount, 0, report.errorCount ? formatter(report.results) : 'linting should not report issues');

        test.end();
    });

    test.end();
});
