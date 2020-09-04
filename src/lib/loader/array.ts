import {TwingLoaderInterface} from "../loader-interface";
import {TwingSource} from "../source";
import {TwingErrorLoader} from "../error/loader";
import {iteratorToMap} from "../helpers/iterator-to-map";

/**
 * Loads template from the filesystem.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingLoaderArray implements TwingLoaderInterface {
    private templates: Map<string, string>;

    constructor(templates: any) {
        this.templates = iteratorToMap(templates);
    }

    setTemplate(name: string, template: string) {
        this.templates.set(name, template);
    }

    getSourceContext(name: string, from: TwingSource): Promise<TwingSource> {
        return this.exists(name, from).then((exists) => {
            if (!exists) {
                throw new TwingErrorLoader(`Template "${name}" is not defined.`, -1, from);
            }

            return new TwingSource(this.templates.get(name), name);
        });
    }

    exists(name: string, from: TwingSource): Promise<boolean> {
        return Promise.resolve(this.templates.has(name));
    }

    getCacheKey(name: string, from: TwingSource): Promise<string> {
        return this.exists(name, from).then((exists) => {
            if (!exists) {
                throw new TwingErrorLoader(`Template "${name}" is not defined.`, -1, from);
            }

            return name + ':' + this.templates.get(name);
        });
    }

    isFresh(name: string, time: number, from: TwingSource): Promise<boolean> {
        return this.exists(name, from).then((exists) => {
            if (!exists) {
                throw new TwingErrorLoader(`Template "${name}" is not defined.`, -1, from);
            }

            return true;
        });
    }

    resolve(name: string, from: TwingSource, shouldThrow: boolean = false): Promise<string> {
        return this.exists(name, from).then((exists) => {
            if (exists) {
                return name;
            }

            if (shouldThrow) {
                throw new TwingErrorLoader(`Template "${name}" is not defined.`, -1, from);
            }

            return null;
        });
    }
}
