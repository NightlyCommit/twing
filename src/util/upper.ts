import TwingEnvironment from "../environment";

export default function twingUpper(env: TwingEnvironment, value: string) {
    // todo: use charset
    return (typeof value === 'string') ? value.toUpperCase() : value;
}