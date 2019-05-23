import {iconv} from "../../helper/iconv";

export function twingFilterConvertEncoding(string: string, to: string, from: string) {
    return iconv(from, to, Buffer.from(string));
}
