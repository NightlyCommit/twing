import TwingNode from "../src/node";
import TwingEnvironment from "../src/environment";
import TwingLoaderArray from "../src/loader/array";
import {Test} from "tape";
import TwingTemplate from "../src/template";
import TwingEnvironmentOptions from "../src/environment-options";

class TwingNodeTestCaseNode {
    env: TwingEnvironment;
    node: TwingNode;
    context: any;
    template: TwingTemplate;

    constructor(node: TwingNode, context: any = {}, options: TwingEnvironmentOptions = {}) {
        this.node = node;
        this.env = new TwingEnvironment(new TwingLoaderArray(new Map([
            ['index', 'foo']
        ])), options);
        this.context = context;
    }

    setNode(node: TwingNode) {
        this.node = node;
    }

    getEnvironment() {
        return this.env;
    }

    render(context: any = {}): any {
        console.warn(this.node.render(context, this.getTemplate()));

        return this.node.render(context, this.getTemplate());
    }

    assertNodeRendering(test: Test, expected: any) {
        let result = this.render(this.context);

        console.log('>>>', result, expected);

        test.same(result, expected);
    }

    assertContext(test: Test, expected: any) {
        this.node.render(this.context, this.getTemplate());

        console.log('>>>', this.context, expected);

        test.same(this.context, expected);
    }

    getTemplate(): TwingTemplate {
        if (this.template) {
            return this.template;
        }

        return this.getEnvironment().loadTemplate('index');
    }

    setTemplate(template: TwingTemplate) {
        this.template = template;
    }

    getCompiler(environment: TwingEnvironment = null): any {
        return null; //new TwingCompiler(environment === null ? this.getEnvironment() : environment);
    }

    getVariableGetter(name: string, line: number = 0): string {
        let lineStr = line > 0 ? `// line ${line}\n` : '';

        return `${lineStr}(context.get(\'${name}\') || null)`;
    }

    getAttributeGetter(): string {
        return 'twig_get_attribute(this.env, this.getSourceContext(), ';
    }
}

export default TwingNodeTestCaseNode;