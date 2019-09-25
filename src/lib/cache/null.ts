import {TwingCacheInterface} from "../cache-interface";
import {TwingTemplatesModule} from "../environment";

/**
 * Implements a no-cache strategy.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
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

    load(key: string): TwingTemplatesModule {
        return () => {
            return new Map();
        };
    }

    getTimestamp(key: string): number {
        return 0;
    }
}
