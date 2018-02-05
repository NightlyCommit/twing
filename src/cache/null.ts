import TwingCache from "../cache";

/**
 * Implements a no-cache strategy.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
class TwingCacheNull extends TwingCache {
    generateKey(name: string, className: string): string {
        return '';
    }

    write(key: string, content: string) {
    }

    load(key: string) {
    }

    getTimestamp(key: string): number {
        return 0;
    }
}

export default TwingCacheNull;