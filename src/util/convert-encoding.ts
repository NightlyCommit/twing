import * as iconv from "iconv-lite";

export default function twingConvertEncoding(string: string, to: string, from: string) {
    let buffer: Buffer = new Buffer(string);

    string = iconv.decode(buffer, from);
    buffer = iconv.encode(string, to) as Buffer;

    return buffer;
}