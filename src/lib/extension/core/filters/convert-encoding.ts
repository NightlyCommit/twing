import {iconv} from "../../../helpers/iconv";

export function convertEncoding(string: string, to: string, from: string): Promise<Buffer> {
    return Promise.resolve(iconv(from, to, Buffer.from(string)));
}
