import {TwingMarkup} from "../../../markup";

/**
 * Removes whitespaces between HTML tags.
 *
 * @return string
 */
export function spaceless(content: string | TwingMarkup) {
    return content.toString().replace(/>\s+</g, '><').trim();
}
