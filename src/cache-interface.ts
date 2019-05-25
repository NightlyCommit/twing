/* istanbul ignore next */

import {TwingTemplate} from "./template";
import {TwingEnvironment} from "./environment";

export interface TwingCacheInterface {
    TwingCacheInterfaceImpl: TwingCacheInterface,

    /**
     * Generates a cache key for the given template.
     *
     * @param {string} name The template name
     * @param {string} hash The template hash
     *
     * @return string
     */
    generateKey(name: string, hash: string): string;

    /**
     * Writes the compiled template to cache.
     *
     * @param {string} key The cache key
     * @param {string} content The template representation as a PHP class
     */
    write(key: string, content: string): void;

    /**
     * Loads a template from the cache.
     *
     * @param {string} key The cache key
     */
    load(key: string): (Runtime: any) => { [s: string]: new(e: TwingEnvironment) => TwingTemplate};

    /**
     * Returns the modification timestamp of a key.
     *
     * @param {string} key The cache key
     *
     * @returns {number}
     */
    getTimestamp(key: string): number;
}
