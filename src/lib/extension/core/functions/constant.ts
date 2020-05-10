import {constant as constantHelper} from "../../../helpers/constant";
import {TwingTemplate} from "../../../template";

export function constant(template: TwingTemplate, name: string, object: any = null): Promise<any> {
    return Promise.resolve(constantHelper(template, name, object));
}
