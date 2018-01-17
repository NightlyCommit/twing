import TwingMethodArgument from "./method-argument";

type TwingMethodDefinition = {
    handler: Function,
    arguments: Array<TwingMethodArgument>
};

export default TwingMethodDefinition;