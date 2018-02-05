interface TwingCacheInterface {
    /**
     * Generates a cache key for the given template class name.
     *
     * @param {string} name The template name
     * @param {string} className The template class name
     *
     * @return string
     */
    generateKey(name: string, className: string): string;

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
    load(key: string): void;

    /**
     * Returns the modification timestamp of a key.
     *
     * @param {string} key The cache key
     *
     * @returns {number}
     */
    getTimestamp(key: string): number;
}

export default TwingCacheInterface;