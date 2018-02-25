import {TwingTest} from "./test";

export interface TwingTestOptions {
    is_variadic?: boolean;
    node_factory?: Function;
    deprecated?: string;
    alternative?: TwingTest;
    need_context?: boolean;
}
