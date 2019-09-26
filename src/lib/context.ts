import {iteratorToMap} from "./helpers/iterator-to-map";

export class TwingContext<K, V> {
    private readonly _container: Map<any, any>;
    private readonly _proxy: any;

    constructor(container: Map<K, V> = new Map()) {
        this._container = container;
        this._proxy = new Proxy(this._container, {
            set: (target: Map<any, any>, key: string | number | symbol, value: any, receiver: any): boolean => {
                target.set(key, value);

                return true;
            },
            get(target: Map<any, any>, key: string | number | symbol, receiver: any): any {
                return target.get(key);
            }
        });
    }

    get proxy() {
        return this._proxy;
    }

    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this._container.entries();
    }

    entries(): IterableIterator<[K, V]> {
        return this._container.entries();
    }

    has(key: K): boolean {
        return this._container.has(key);
    }

    set(key: K, value: V): this {
        this._container.set(key, value);

        return this;
    }

    get(key: K): V {
        let value: any = this._container.get(key);

        if (Array.isArray(value)) {
            value = iteratorToMap(value);
        }

        return value;
    }

    delete(key: K): boolean {
        return this._container.delete(key);
    }

    clone(): TwingContext<K, V> {
        let clonedContainer: Map<K, V> = new Map();

        for (let [key, value] of this._container) {
            clonedContainer.set(key, value);
        }

        return new TwingContext<K, V>(clonedContainer);
    }
}
