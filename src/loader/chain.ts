import TwingLoaderInterface from "../loader-interface";
import TwingTemplate from "../template";
import TwingMap from "../map";
import TwingErrorLoader from "../error/loader";
import TwingSource from "../source";

/**
 * Loads templates from other loaders.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export class TwingLoaderChain implements TwingLoaderInterface {
    private hasSourceCache: TwingMap<string, TwingTemplate> = new TwingMap();
    private loaders: Array<TwingLoaderInterface> = [];

    /**
     * @param {Array<TwingLoaderInterface>} loaders
     */
    constructor(loaders: Array<TwingLoaderInterface> = []) {
        for (let loader of loaders) {
            this.addLoader(loader);
        }
    }

    addLoader(loader: TwingLoaderInterface) {
        this.loaders.push(loader);
        this.hasSourceCache = new TwingMap();
    }

    getSourceContext(name: string): TwingSource {
        let exceptions = [];

        for (let loader of this.loaders) {
            if (!loader.exists(name)) {
                continue;
            }

            try {
                return loader.getSourceContext(name);
            }
            catch (e) {
                if (e instanceof TwingErrorLoader) {
                    exceptions.push(e.message);
                }
            }
        }

        throw new TwingErrorLoader(`Template "${name}" is not defined${exceptions ? ' (' + exceptions.join(', ') + ')' : ''}.`);
    }

    exists(name: string) {
        if (this.hasSourceCache.has(name)) {
            return this.hasSourceCache.get(name);
        }

        for (let loader of this.loaders) {
            if (loader.exists(name)) {
                this.hasSourceCache.set(name, true);

                return true;
            }
        }

        this.hasSourceCache.set(name, false);

        return false;
    }

    getCacheKey(name: string) {
        let exceptions = [];

        for (let loader of this.loaders) {
            if (!loader.exists(name)) {
                continue;
            }

            try {
                return loader.getCacheKey(name);
            }
            catch (e) {
                if (e instanceof TwingErrorLoader) {
                    exceptions.push(loader.constructor.name + ': ' + e.message);
                }
            }
        }

        throw new TwingErrorLoader(`Template "${name}" is not defined${exceptions ? ' (' + exceptions.join(', ') + ')' : ''}.`);
    }

    isFresh(name: string, time: number) {
        let exceptions = [];

        for (let loader of this.loaders) {
            if (!loader.exists(name)) {
                continue;
            }

            try {
                return loader.isFresh(name, time);
            }
            catch (e) {
                if (e instanceof TwingErrorLoader) {
                    exceptions.push(loader.constructor.name + ': ' + e.message);
                }
            }
        }

        throw new TwingErrorLoader(`Template "${name}" is not defined${exceptions ? ' (' + exceptions.join(', ') + ')' : ''}.`);
    }
}

export default TwingLoaderChain;