import * as tape from 'tape';
import {TwingNodeCheckSecurity} from "../../../../../../src/lib/node/check-security";
import {TwingCompiler} from "../../../../../../src/lib/compiler";
import {TwingEnvironmentNode} from "../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../src/lib/loader/array";

tape('node/check-security', (test) => {
    test.test('compile', (test) => {
        let node = new TwingNodeCheckSecurity(new Map([['foo', 'bar']]), new Map([['foo', 'bar']]), new Map([['foo', 'bar']]));
        let compiler = new TwingCompiler(new TwingEnvironmentNode(new TwingLoaderArray({})));

        test.same(compiler.compile(node).getSource(), `let tags = new Map([[\`bar\`, null]]);
let filters = new Map([[\`bar\`, null]]);
let functions = new Map([[\`bar\`, null]]);

try {
    this.env.checkSecurity(
        [\'bar\'],
        [\'bar\'],
        [\'bar\']
    );
}
catch (e) {
    if (e instanceof this.SandboxSecurityError) {
        e.setSourceContext(this.source);

        if (e instanceof this.SandboxSecurityNotAllowedTagError && tags.has(e.getTagName())) {
            e.setTemplateLine(tags.get(e.getTagName()));
        }
        else if (e instanceof this.SandboxSecurityNotAllowedFilterError && filters.has(e.getFilterName())) {
            e.setTemplateLine(filters.get(e.getFilterName()));
        }
        else if (e instanceof this.SandboxSecurityNotAllowedFunctionError && functions.has(e.getFunctionName())) {
            e.setTemplateLine(functions.get(e.getFunctionName()));
        }
    }

    throw e;
}

`);

        test.end();
    });

    test.end();
});