import {TwingEnvironment} from "../../../environment";
import {constant as constantHelper} from "../../../helpers/constant";

export function constant(env: TwingEnvironment, name: string, object: any = null): Promise<any> {
    return Promise.resolve(constantHelper(env, name, object));
}
