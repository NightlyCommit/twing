import {TwingFilter} from "./filter";

export type TwingFilterOptions = {
    needs_environment?: boolean;
    needs_context?: boolean;
    is_variadic?: boolean;
    is_safe?: Array<any>;
    is_safe_callback?: Function;
    pre_escape?: string;
    preserves_safety?: Array<string>;
    expression_factory?: Function;
    deprecated?: string;
    alternative?: TwingFilter;
}
