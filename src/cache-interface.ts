/**
 * Interface implemented by cache classes.
 *
 * It is highly recommended to always store templates on the filesystem to
 * benefit from the PHP opcode cache. This interface is mostly useful if you
 * need to implement a custom strategy for storing templates on the filesystem.
 *
 * @author Andrew Tch <andrew@noop.lv>
 */

interface TwingCacheInterface {
    /**
     * Generates a cache key for the given template class name.
     *
     * @param {string} name
     * @param {string} className
     * @returns {string}
     */
    generateKey(name: string, className: string): string;

    /**
     * Writes the compiled template to cache.
     *
     * @param {string} key
     * @param {string} content
     */
    write(key: string, content: string): string;

    /**
     * Loads a template from the cache.
     *
     * @param {string} key
     */
    load(key: string): void;

    /**
     * Returns the modification timestamp of a key.
     *
     * @param {string} key
     * @returns {number}
     */
    getTimestamp(key: string): number;
}

export = TwingCacheInterface;