import * as iconvLite from "iconv-lite";

/**
 * Convert string to requested character encoding
 * @link http://php.net/manual/en/function.iconv.php
 * @param {string} inCharset The input charset.
 * @param {string} outCharset The output charset.
 * @param {string} str The string to be converted.
 *
 * @returns {string} the converted string or false on failure.
 */
export function iconv(inCharset: string, outCharset: string, str: string) {
    let buffer: Buffer = new Buffer(str);

    str = iconvLite.decode(buffer, inCharset);
    buffer = iconvLite.encode(str, outCharset) as Buffer;

    return buffer;
}
