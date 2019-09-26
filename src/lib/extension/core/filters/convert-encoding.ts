import {iconv} from "../../../helpers/iconv";

export function convertEncoding(string: string, to: string, from: string) {
    return iconv(from, to, Buffer.from(string));
}
