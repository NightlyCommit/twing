import TwingTest from "./test";

interface TwingTestOptions {
    is_variadic?: boolean;
    node_class?: string;
    node_factory?: Function;
    deprecated?: string;
    alternative?: TwingTest;
    need_context?: boolean;
}

export default TwingTestOptions;