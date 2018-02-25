export interface TwingOperatorDefinitionInterface {
    precedence: number;
    associativity?: string,
    factory: Function;
    callable?: Function;
}
