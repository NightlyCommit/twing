import {TwingContext} from "../context";

export function isMap(candidate: any): candidate is Map<any, any> {
    return (candidate instanceof Map || candidate instanceof TwingContext);
}
