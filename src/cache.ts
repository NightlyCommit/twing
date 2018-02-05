import TwingCacheInterface from "./cache-interface";

abstract class TwingCache implements TwingCacheInterface {
    generateKey(name: string, className: string): string {
        throw new Error('Method not implemented.');
    }

    write(key: string, content: string): void {
        throw new Error('Method not implemented.');
    }

    load(key: string): any {
        throw new Error('Method not implemented.');
    }

    getTimestamp(key: string): number {
        throw new Error('Method not implemented.');
    }

}

export default TwingCache;