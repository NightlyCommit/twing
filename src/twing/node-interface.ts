import {TwingCompiler} from "./compiler";

export interface TwingNodeInterface {
    compile(compiler: TwingCompiler): any;
}
