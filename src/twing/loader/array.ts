import {TwingLoaderInterface} from "../loader-interface";
import {TwingSource} from "../source";
import {TwingErrorLoader} from "../error/loader";
import {TwingMap} from "../map";

/**
 * Loads template from the filesystem.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingLoaderArray implements TwingLoaderInterface {
    private templates: TwingMap<string, string>;

    constructor(templates: any) {
        let map = new TwingMap();

        if (Array.isArray(templates)) {
            for (let template of templates) {
                map.push(template);
            }
        }
        else if (typeof templates[Symbol.iterator] === 'function') {
            for (let [name, template] of templates) {
                map.set(name, template);
            }
        }
        else if (typeof templates === 'object') {
            for (let name in templates) {
                map.set(name, templates[name]);
            }
        }

        this.templates = map;
    }

    setTemplate(name: string, template: string) {
        this.templates.set(name, template);
    }

    getSourceContext(name: string): TwingSource {
        if (!this.exists(name)) {
            throw new TwingErrorLoader(`Template "${name}" is not defined.`);
        }

        return new TwingSource(this.templates.get(name), name);
    }

    exists(name: string | number) {
        return this.templates.has(name);
    }

    getCacheKey(name: string): string {
        if (!this.exists(name)) {
            throw new TwingErrorLoader(`Template "${name}" is not defined.`);
        }

        return name + ':' + this.templates.get(name);
    }

    isFresh(name: string, time: number): boolean {
        if (!this.exists(name)) {
            throw new TwingErrorLoader(`Template "${name}" is not defined.`);
        }

        return true;
    }
}
