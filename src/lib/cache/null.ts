import {TwingCacheInterface} from "../cache-interface";
import {TwingTemplateModule} from "../environment";

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

    load(key: string): TwingTemplateModule {
        return () => {
            return new Map();
        };
    }

    getTimestamp(key: string): number {
        return 0;
    }
}
