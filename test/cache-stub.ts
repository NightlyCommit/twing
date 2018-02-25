import {TwingCache} from "../src/cache";

export class TwingTestCacheStub extends TwingCache {
    generateKey(name: string, className: string): string {
        return 'key'
    }

    write(key: string, content: string): void {

    }

    load(key: string): any {
        return null;
    }

    getTimestamp(key: string): number {
        return 0;
    }
}
