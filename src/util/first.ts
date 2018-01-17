import TwingEnvironment from "../environment";

import slice from '../util/slice';

export default function twingFirst(env: TwingEnvironment, item: any) {
    let elements = slice(env, item, 0, 1, false);

    return typeof elements === 'string' ? elements : elements.first();
}