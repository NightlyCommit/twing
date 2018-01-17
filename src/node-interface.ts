import TwingCompiler from "./compiler";
import DoDisplayHandler from "./do-display-handler";

interface TwingNodeInterface {
    compile(compiler: TwingCompiler): DoDisplayHandler;
}

export default TwingNodeInterface;