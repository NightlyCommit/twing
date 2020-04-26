import {TwingNodeExpressionArray} from "./array";
import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node-type";

export const type = new TwingNodeType('expression_hash');

export class TwingNodeExpressionHash extends TwingNodeExpressionArray {
    get type() {
        return type;
    }

    /**
     * hash node is also an array node.
     *
     * @param type
     */
    is(type: TwingNodeType): boolean {
        return (type === super.type) || super.is(type);
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw('new Map([')
        ;

        let first = true;

        for (let pair of this.getKeyValuePairs()) {
            if (!first) {
                compiler.raw(', ');
            }

            first = false;

            compiler
                .raw('[')
                .subcompile(pair.key)
                .raw(', ')
                .subcompile(pair.value)
                .raw(']')
            ;
        }

        compiler.raw('])');
    }
}
