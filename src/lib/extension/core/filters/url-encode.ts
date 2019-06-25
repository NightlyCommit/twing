import {isTraversable} from "../../../helpers/is-traversable";
import {iteratorToHash} from "../../../helpers/iterator-to-hash";

const http_build_query = require('locutus/php/url/http_build_query');

/**
 * URL encodes (RFC 3986) a string as a path segment or a hash as a query string.
 *
 * @param {string|{}} url A URL or a hash of query parameters
 *
 * @returns {string} The URL encoded value
 */
export function twingFilterUrlEncode(url: string | {}): string {
    if (typeof url !== 'string') {
        if (isTraversable(url)) {
            url = iteratorToHash(url);
        }

        let builtUrl: string = http_build_query(url, '', '&');

        return builtUrl.replace(/\+/g, '%20');
    }

    return encodeURIComponent(url);
}
