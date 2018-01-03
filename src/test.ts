import TwingTestOptions from "./test-options";
import TwingNodeExpression from "./node/expression";

abstract class TwingTest {
    abstract getNodeFactory(): Function;
}

export default TwingTest;