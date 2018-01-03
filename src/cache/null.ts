import TwingCacheInterface = require("../cache-interface");

/**
 * Implements a no-cache strategy.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
class TwingCacheNull implements TwingCacheInterface {
    generateKey(name: string, className: string): string {
        return '';
    }

    write(key: string, content: string): string {
        return null;
    }

    load(key: string): void {
    }

    getTimestamp(key: string): number {
        return 0;
    }
}

export = TwingCacheNull;