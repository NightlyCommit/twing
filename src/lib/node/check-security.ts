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
            .write('this.env.checkSecurity(')
            .repr(tags)
            .raw(', ')
            .repr(filters)
            .raw(', ')
            .repr(functions)
            .raw(');\n\n')
        ;
    }
}
