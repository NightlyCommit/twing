import * as tape from "tape";
import {ESLint} from "eslint";
import {resolve} from "path";

tape('code quality', (test) => {
    test.test('linting', async (test) => {
        const eslint = new ESLint();
        const results = await eslint.lintFiles([
            resolve('src/**/*.ts'),
            resolve('test/**/*.ts')
        ]);

        const errorCount = results.reduce((previousValue, result) => previousValue + result.errorCount, 0);

        test.same(errorCount, 0, 'linting should not report issues');

        if (errorCount) {
            const formatter = await eslint.loadFormatter();
            const report = formatter.format(results);
            console.log(report);
        }

        test.end();
    });

    test.end();
});
