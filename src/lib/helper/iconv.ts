import * as iconvLite from "iconv-lite";

/**
 * Internationalization conversion: convert buffer to requested character encoding
 *
 * @param {string} inCharset The input charset.
 * @param {string} outCharset The output charset.
 * @param {Buffer} buffer The buffer to be converted.
 *
 * @returns {Buffer} the converted buffer or false on failure.
 */
export function iconv(inCharset: string, outCharset: string, buffer: Buffer): Buffer {
    let str = iconvLite.decode(buffer, inCharset);

    buffer = iconvLite.encode(str, outCharset) as Buffer;

    return buffer;
}
