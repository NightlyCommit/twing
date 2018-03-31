import {TwingLoaderInterface} from "../loader-interface";
import {TwingSource} from "../source";
import {TwingErrorLoader} from "../error/loader";

const nodePath = require('path');
const fs = require('fs');
const rtrim = require('locutus/php/strings/rtrim');

/**
 * Loads template from the filesystem.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingLoaderFilesystem implements TwingLoaderInterface {
    TwingLoaderInterfaceImpl: TwingLoaderInterface;

    /** Identifier of the main namespace. */
    static MAIN_NAMESPACE = '__main__';

    protected paths: Map<string, Array<string>> = new Map();
    protected cache: Map<string, string> = new Map();
    protected errorCache: Map<string, string> = new Map();

    private rootPath: string;

    /**
     * @param {string | Array<string>} paths A path or a map of paths where to look for templates
     * @param {string} rootPath The root path common to all relative paths (null for process.cwd())
     */
    constructor(paths: string | Array<string> = [], rootPath: string = null) {
        this.TwingLoaderInterfaceImpl = this;

        rootPath = (rootPath === null ? process.cwd() : rootPath);

        this.rootPath = nodePath.resolve(rootPath);

        if (paths) {
            this.setPaths(paths);
        }
    }

    /**
     * Returns the paths to the templates.
     *
     * @param {string} namespace A path namespace
     *
     * @returns Array<string> The array of paths where to look for templates
     */
    getPaths(namespace: string = TwingLoaderFilesystem.MAIN_NAMESPACE): Array<string> {
        return this.paths.has(namespace) ? this.paths.get(namespace) : [];
    }

    /**
     * Returns the path namespaces.
     *
     * The main namespace is always defined.
     *
     * @returns Array<string> The array of defined namespaces
     */
    getNamespaces(): Array<string> {
        return [...this.paths.keys()];
    }

    /**
     * Sets the paths where templates are stored.
     *
     * @param {string|Array<string>} paths A path or an array of paths where to look for templates
     * @param {string} namespace A path namespace
     */
    setPaths(paths: string | Array<string>, namespace: string = TwingLoaderFilesystem.MAIN_NAMESPACE) {
        if (!Array.isArray(paths)) {
            paths = [paths as string];
        }

        this.paths.set(namespace, []);

        for (let path of paths) {
            this.addPath(path, namespace);
        }
    }

    /**
     * Adds a path where templates are stored.
     *
     * @param {string} path A path where to look for templates
     * @param {string} namespace A path namespace
     *
     * @throws TwingErrorLoader
     */
    addPath(path: string, namespace: string = TwingLoaderFilesystem.MAIN_NAMESPACE) {
        // invalidate the cache
        this.cache = new Map();
        this.errorCache = new Map();

        let checkPath = this.isAbsolutePath(path) ? path : nodePath.join(this.rootPath, path);

        let stat = fs.statSync(this.normalizeName(checkPath));

        if (!stat.isDirectory()) {
            throw new TwingErrorLoader(`The "${path}" directory does not exist ("${checkPath}").`);
        }

        if (!this.paths.has(namespace)) {
            this.paths.set(namespace, []);
        }

        this.paths.get(namespace).push(rtrim(path, '\/\\\\'));
    }

    /**
     * Prepends a path where templates are stored.
     *
     * @param {string} path A path where to look for templates
     * @param {string} namespace A path namespace
     *
     * @throws TwingErrorLoader
     */
    prependPath(path: string, namespace: string = TwingLoaderFilesystem.MAIN_NAMESPACE) {
        // invalidate the cache
        this.cache = this.errorCache = new Map();

        let checkPath = this.isAbsolutePath(path) ? path : nodePath.join(this.rootPath, path);

        let stat = fs.statSync(this.normalizeName(checkPath));

        if (!stat.isDirectory()) {
            throw new TwingErrorLoader(`The "${path}" directory does not exist ("${checkPath}").`);
        }

        path = rtrim(path, '\/\\\\');

        if (!this.paths.has(namespace)) {
            this.paths.set(namespace, [path]);
        }
        else {
            this.paths.get(namespace).unshift(path);
        }
    }

    getSourceContext(name: string): TwingSource {
        let path = this.findTemplate(name);

        return new TwingSource(fs.readFileSync(path).toString(), name, path);
    }

    getCacheKey(name: string): string {
        let path = this.findTemplate(name);

        return nodePath.relative(this.rootPath, path);
    }

    exists(name: string): boolean {
        name = this.normalizeName(name);

        if (this.cache.has(name)) {
            return true;
        }

        return this.findTemplate(name, false) !== null;
    }

    isFresh(name: string, time: number): boolean {
        let stat = fs.statSync(this.findTemplate(name));

        return stat.mtimeMs <= time;
    }

    /**
     * Checks if the template can be found.
     *
     * @param {string} name  The template name
     * @param {boolean} throw_ Whether to throw an exception when an error occurs
     *
     * @returns {string} The template name or null
     */
    protected findTemplate(name: string, throw_: boolean = true): string {
        name = this.normalizeName(name);

        if (this.cache.has(name)) {
            return this.cache.get(name);
        }

        if (this.errorCache.has(name)) {
            if (!throw_) {
                return null;
            }

            throw new TwingErrorLoader(this.errorCache.get(name));
        }

        this.validateName(name);

        let namespace: string;
        let shortname: string;

        [namespace, shortname] = this.parseName(name);

        if (!this.paths.has(namespace)) {
            this.errorCache.set(name, `There are no registered paths for namespace "${namespace}".`);

            if (!throw_) {
                return null;
            }

            throw new TwingErrorLoader(this.errorCache.get(name));
        }

        for (let path of this.paths.get(namespace)) {
            if (!this.isAbsolutePath(path)) {
                path = nodePath.join(this.rootPath, path);
            }

            try {
                let stat = fs.statSync(nodePath.join(path, shortname));

                if (stat.isFile()) {
                    this.cache.set(name, nodePath.resolve(nodePath.join(path, shortname)));

                    return this.cache.get(name);
                }
            }
            catch (e) {
                // let's continue searching
            }
        }

        this.errorCache.set(name, `Unable to find template "${name}" (looked into: ${this.paths.get(namespace)}).`);

        if (!throw_) {
            return null;
        }

        throw new TwingErrorLoader(this.errorCache.get(name));
    }

    private normalizeName(name: string) {
        if (name === null) {
            return '';
        }

        return name.replace(/\\/g, '/').replace(/\/{2,}/g, '/')
    }

    private parseName(name: string, default_: string = TwingLoaderFilesystem.MAIN_NAMESPACE) {
        if (name[0] === '@') {
            let pos = name.indexOf('/');

            if (pos < 0) {
                throw new TwingErrorLoader(`Malformed namespaced template name "${name}" (expecting "@namespace/template_name").`);
            }

            let namespace = name.substr(1, pos - 1);
            let shortname = name.substr(pos + 1);

            return [namespace, shortname];
        }

        return [default_, name];
    }

    private validateName(name: string) {
        if (name.indexOf(`\0`) > -1) {
            throw new TwingErrorLoader('A template name cannot contain NUL bytes.');
        }

        let parts = name.split(nodePath.sep);
        let level = 0;

        for (let part of parts) {
            if (part === '..') {
                level--;
            }
            else if (part !== '.') {
                level++;
            }
        }

        if (level < 0) {
            throw new TwingErrorLoader(`Looks like you try to load a template outside configured directories (${name}).`);
        }
    }

    private isAbsolutePath(file: string) {
        return nodePath.isAbsolute(file);
    }
}
