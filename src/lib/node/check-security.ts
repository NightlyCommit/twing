import {TwingNode} from "../node";

import {TwingCompiler} from "../compiler";

export class TwingNodeCheckSecurity extends TwingNode {
    private usedFilters: Map<string, TwingNode | string>;
    private usedTags: Map<string, TwingNode | string>;
    private usedFunctions: Map<string, TwingNode | string>;

    constructor(usedFilters: Map<string, TwingNode | string>, usedTags: Map<string, TwingNode | string>, usedFunctions: Map<string, TwingNode | string>) {
        super();

        this.usedFilters = usedFilters;
        this.usedTags = usedTags;
        this.usedFunctions = usedFunctions;
    }

    compile(compiler: TwingCompiler) {
        let tags = new Map();

        for (let [name, node] of this.usedTags) {
            if (typeof node === 'string') {
                tags.set(node, null);
            }
            else {
                tags.set(name, node.getTemplateLine());
            }
        }

        let filters = new Map();

        for (let [name, node] of this.usedFilters) {
            if (typeof node === 'string') {
                filters.set(node, null);
            }
            else {
                filters.set(name, node.getTemplateLine());
            }
        }

        let functions = new Map();

        for (let [name, node] of this.usedFunctions) {
            if (typeof node === 'string') {
                functions.set(node, null);
            }
            else {
                functions.set(name, node.getTemplateLine());
            }
        }

        compiler
            .write('let tags = ').repr(tags).raw(";\n")
            .write('let filters = ').repr(filters).raw(";\n")
            .write('let functions = ').repr(functions).raw(";\n\n")
            .write("try {\n")
            .indent()
            .write("this.env.checkSecurity(\n")
            .indent()
            .write(!tags.size ? "[],\n" : "['" + [...tags.keys()].join('\', \'') + "'],\n")
            .write(!filters.size ? "[],\n" : "['" + [...filters.keys()].join('\', \'') + "'],\n")
            .write(!functions.size ? "[]\n" : "['" + [...functions.keys()].join('\', \'') + "']\n")
            .outdent()
            .write(");\n")
            .outdent()
            .write("}\n")
            .write("catch (e) {\n")
            .indent()
            .write("if (e instanceof this.SandboxSecurityError) {\n")
            .indent()
            .write("e.setSourceContext(this.getSourceContext());\n\n")
            .write("if (e instanceof this.SandboxSecurityNotAllowedTagError && tags.has(e.getTagName())) {\n")
            .indent()
            .write("e.setTemplateLine(tags.get(e.getTagName()));\n")
            .outdent()
            .write("}\n")
            .write("else if (e instanceof this.SandboxSecurityNotAllowedFilterError && filters.has(e.getFilterName())) {\n")
            .indent()
            .write("e.setTemplateLine(filters.get(e.getFilterName()));\n")
            .outdent()
            .write("}\n")
            .write("else if (e instanceof this.SandboxSecurityNotAllowedFunctionError && functions.has(e.getFunctionName())) {\n")
            .indent()
            .write("e.setTemplateLine(functions.get(e.getFunctionName()));\n")
            .outdent()
            .write("}\n")
            .outdent()
            .write('}\n\n')
            .write("throw e;\n")
            .outdent()
            .write("}\n\n")
        ;
    }
}
