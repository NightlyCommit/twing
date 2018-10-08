import {TwingLoaderInterface} from "../loader-interface";
import {TwingErrorLoader} from "../error/loader";
import {TwingSource} from "../source";

/**
 * Loads templates from other loaders.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingLoaderChain implements TwingLoaderInterface {
    TwingLoaderInterfaceImpl: TwingLoaderInterface;

    private hasSourceCache: Map<string, boolean> = new Map();
    private loaders: Array<TwingLoaderInterface> = [];

    /**
     * @param {Array<TwingLoaderInterface>} loaders
     */
    constructor(loaders: Array<TwingLoaderInterface> = []) {
        this.TwingLoaderInterfaceImpl = this;

        for (let loader of loaders) {
            this.addLoader(loader);
        }
    }

    addLoader(loader: TwingLoaderInterface) {
        this.loaders.push(loader);
        this.hasSourceCache = new Map();
    }

    getSourceContext(name: string, from: TwingSource): TwingSource {
        let exceptions = [];

        for (let loader of this.loaders) {
            if (!loader.exists(name, from)) {
                continue;
            }

            try {
                return loader.getSourceContext(name, from);
            }
            catch (e) {
                if (e instanceof TwingErrorLoader) {
                    exceptions.push(e.message);
                }
            }
        }

        throw new TwingErrorLoader(`Template "${name}" is not defined${exceptions.length ? ' (' + exceptions.join(', ') + ')' : ''}.`);
    }

    exists(name: string, from: TwingSource) {
        if (this.hasSourceCache.has(name)) {
            return this.hasSourceCache.get(name);
        }

        for (let loader of this.loaders) {
            if (loader.exists(name, from)) {
                this.hasSourceCache.set(name, true);

                return true;
            }
        }

        this.hasSourceCache.set(name, false);

        return false;
    }

    getCacheKey(name: string, from: TwingSource) {
        let exceptions = [];

        for (let loader of this.loaders) {
            if (!loader.exists(name, from)) {
                continue;
            }

            try {
                return loader.getCacheKey(name, from);
            }
            catch (e) {
                if (e instanceof TwingErrorLoader) {
                    exceptions.push(loader.constructor.name + ': ' + e.message);
                }
            }
        }

        throw new TwingErrorLoader(`Template "${name}" is not defined${exceptions.length ? ' (' + exceptions.join(', ') + ')' : ''}.`);
    }

    isFresh(name: string, time: number, from: TwingSource) {
        let exceptions = [];

        for (let loader of this.loaders) {
            if (!loader.exists(name, from)) {
                continue;
            }

            try {
                return loader.isFresh(name, time, from);
            }
            catch (e) {
                if (e instanceof TwingErrorLoader) {
                    exceptions.push(loader.constructor.name + ': ' + e.message);
                }
            }
        }

        throw new TwingErrorLoader(`Template "${name}" is not defined${exceptions.length ? ' (' + exceptions.join(', ') + ')' : ''}.`);
    }

    resolve(name: string, from: TwingSource): string {
        let exceptions = [];

        for (let loader of this.loaders) {
            if (!loader.exists(name, from)) {
                continue;
            }

            try {
                return loader.resolve(name, from);
            }
            catch (e) {
                if (e instanceof TwingErrorLoader) {
                    exceptions.push(loader.constructor.name + ': ' + e.message);
                }
            }
        }

        throw new TwingErrorLoader(`Template "${name}" is not defined${exceptions.length ? ' (' + exceptions.join(', ') + ')' : ''}.`);
    }
}
