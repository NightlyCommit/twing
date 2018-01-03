import {Test} from "tape";
import TwingNode from "../node";
import TwingEnvironment = require("../environment");
import TwingLoaderArray = require("../loader/array");

class TwingTestCaseNode {
    assertNodeCompilation(test: Test, node: TwingNode, source: string, environment: TwingEnvironment = null, isPattern: boolean = false) {
        let compiler = this.getCompiler(environment);

        compiler.compile(node);

        let compilerSource = compiler.getSource().trim();

        console.log('<<<', source);
        console.log('>>>', compilerSource);

        if (isPattern) {
            return false;
            // test.assertStringMatchesFormat(source, compiler.getSource().trim());
        }
        else {
            test.same(compilerSource, source);
        }
    }

    getCompiler(environment: TwingEnvironment = null): any {
        return null; //new TwingCompiler(environment === null ? this.getEnvironment() : environment);
    }

    getEnvironment(): TwingEnvironment {
        return new TwingEnvironment(new TwingLoaderArray(new Map()));
    }

    getVariableGetter(name: string, line: number = 0): string {
        let lineStr = line > 0 ? `// line ${line}\n` : '';

        return `${lineStr}(context.get(\'${name}\') || null)`;
    }

    getAttributeGetter(): string {
        return 'twig_get_attribute(this.env, this.getSourceContext(), ';
    }
}

export default TwingTestCaseNode;