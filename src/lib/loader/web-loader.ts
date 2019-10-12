import { TwingLoaderArray, TwingLexer, TwingEnvironment, TwingLoaderNull } from "../../main";
import { Token } from "twig-lexer";

type IWebTemplate = {
    name:string;
    source:string;
    options?:object;
}

/**
 * Loads template from a user defined function (made for the browser).
 *
 * @author Noel Schenk <schenknoel@gmail.com>
 */

class WebTemplate implements IWebTemplate{
    name:string;
    source:string;
    options?:object;
    constructor(params:IWebTemplate){
        this.name = params.name;
        this.source = params.source;
        this.options = params.options;

    }
}

export class TwingWebLoader extends TwingLoaderArray{
    readonly loader:(path:string)=>Promise<string>;
    private readonly isLoaded:Promise<void>; //doesn't load the template but contains the then function which fires once all the templates are loaded

    private constructor(loader:(path:string)=>Promise<string>, template:string, options:object = {}){
        super({'webLoader':'Templates are loaded using a WebLoader'});
        this.loader = loader;
        this.isLoaded = new Promise((resolve)=>{
            this.addTemplate(template, options).then(()=>{
                resolve();
            });
        });
    }

    static getNewInstance(loader:(path:string)=>Promise<string>, template:string, options:object = {}){
        let newTwingWebLoader = new TwingWebLoader(loader,template,options);
        return ((cb:(twingWebLoader:TwingWebLoader)=>void) => newTwingWebLoader.then(newTwingWebLoader,cb)); //passing the webloader otherwise the context/this is losed as we just return the function then
    }

    //use then before accessing TwingWebLoader after init
    then(thisTwingLoader:TwingWebLoader, cb:(twingWebLoader:TwingWebLoader)=>void){
        thisTwingLoader.isLoaded.then(()=>{
            cb(thisTwingLoader);
        });
    }
    addTemplate(template:string, options:object = {}){
        let webTemplate = new WebTemplate({name:"template_" + Math.floor(Math.random() * 1000), source:template, options:options}); //maybe use getTemplateHash instead of math.floor
        return this.preLoadTemplates([webTemplate]).then((templates)=>{
            templates.forEach(template=>{
                this.setTemplate(template.name, template.source);
            });
        });
    }
    private preLoadTemplates(templates:WebTemplate[]){
        let allTemplates = templates.map(template=>{
            let lexedString:Token[] = new TwingLexer(new TwingEnvironment(new TwingLoaderNull()), template.options).tokenize(template.source);
            let promisedTemplates = <Promise<WebTemplate[]>[]>lexedString.map((v:Token, i:number, tt:Token[])=>{
                let val:string = v.value || '';
                if(val.includes('include')){
                    return this.loadTemplate(tt[i+3].value);
                }else{
                    return null;
                }
            }).filter((v)=>{
                return v!=null;
            });
            return this.resolveTemplates(promisedTemplates);
        });
        return this.resolveTemplates(allTemplates);
    }   
    private resolveTemplates(templates:Promise<WebTemplate[]>[]){
        return new Promise<WebTemplate[]>((resolve)=>{
            Promise.all(templates).then((loadedTemplates)=>{
                let allTemplates = new Array<WebTemplate>();
                loadedTemplates.map(loadedTemplateWithSubs=>{loadedTemplateWithSubs.map((loadedTemplate)=>{allTemplates = allTemplates.concat(loadedTemplate)})});
                resolve(allTemplates);
            });
        });
    }
    private loadTemplate(path:string):Promise<WebTemplate[]>{
        return new Promise<WebTemplate[]>((resolve)=>{
            this.loader(path).then((source)=>{
                let loadedTemplate = new Array(new WebTemplate({name:path, source:source}));
                this.preLoadTemplates(loadedTemplate).then((loadedTemplates)=>{ //load other templates needed by this template - recursive templates won't work
                    resolve(loadedTemplate.concat(loadedTemplates));
                });
            });
        });
    }
}