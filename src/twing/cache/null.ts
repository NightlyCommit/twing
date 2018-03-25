import {TwingCacheInterface} from "../cache-interface";

/**
 * Implements a no-cache strategy.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export class TwingCacheNull implements TwingCacheInterface {
    TwingCacheInterfaceImpl: TwingCacheInterface;

    constructor() {
        this.TwingCacheInterfaceImpl = this;
    }

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
