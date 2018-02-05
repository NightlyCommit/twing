import TwingCompiler from "./compiler";

interface TwingNodeInterface {
    compile(compiler: TwingCompiler): any;
}

export default TwingNodeInterface;