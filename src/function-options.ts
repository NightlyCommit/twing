export type TwingFunctionOptions = {
    needs_environment?: boolean;
    needs_context?: boolean;
    is_variadic?: boolean;
    is_safe?: Array<string>;
    is_safe_callback?: Function;
    expression_factory?: Function;
    deprecated?: string;
    alternative?: string;
}
