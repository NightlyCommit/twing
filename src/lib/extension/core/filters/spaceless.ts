import {TwingMarkup} from "../../../markup";

/**
 * Removes whitespaces between HTML tags.
 *
 * @return {Promise<string>}
 */
export function spaceless(content: string | TwingMarkup): Promise<string> {
    return Promise.resolve(content.toString().replace(/>\s+</g, '><').trim());
}
