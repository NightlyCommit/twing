import { TwingLoaderArray, TwingTokenStream, TwingLexer, TwingEnvironment, TwingLoaderNull, TwingSource } from "../../main";
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

export class WebTemplate implements IWebTemplate{
    name:string;
    source:string;
    options?:object;
    constructor(params:IWebTemplate){
        this.name = params.name;
        this.source = params.source;
        this.options = params.options;
        
    }
}

class WebLoader extends TwingLoaderArray{
    readonly loader:(path:string)=>Promise<string>;
    readonly check:Promise<void>; //doesn't load the template but contains the then function which fires once all the templates are loaded
    constructor(loader:(path:string)=>Promise<string>, template:string, options:object = {}){
        super({'webLoader':'Templates are loaded using a WebLoader'});
        this.loader = loader;
        this.check = new Promise((resolve)=>{
            this.addTemplate(template, options).then(()=>{
                resolve();
            });
        });
    }
    addTemplate(template:string, options:object = {}){
        let webTemplate = new WebTemplate({name:"template_" + Math.floor(Math.random() * 1000), source:template, options:options}); //maybe use getTemplateHash instead of math.floor
        return this.preLoadTemplates(webTemplate).then((templates)=>{
            templates.forEach(template=>{
                this.setTemplate(template.name, template.source);
            });
        });
    }
    private preLoadTemplates(template:WebTemplate){
        return new Promise<WebTemplate[]>((resolve)=>{
            let lexedString:Token[] = new TwingLexer(new TwingEnvironment(new TwingLoaderNull()), template.options).tokenize(template.source);
            let loadedTemplates = <Promise<WebTemplate>[]>lexedString.map((v:Token, i:number, tt:Token[])=>{
                let val:string = v.value || '';
                if(val.includes('include')){
                    return this.loadTemplate(tt[i+1].value);
                }else{
                    return null;
                }
            }).filter((v)=>{
                return v!=null;
            });
            Promise.all(loadedTemplates).then((loadedWebTemplates)=>{
                resolve(loadedWebTemplates);
            });
        });
    }   
    private loadTemplate(path:string):Promise<WebTemplate>{
        return new Promise<WebTemplate>((resolve)=>{
            this.loader(path).then((source)=>{
                let loadedTemplate = new WebTemplate({name:path, source:source});
                this.preLoadTemplates(loadedTemplate).then(()=>{ //load other templates needed by this template - recursive templates won't work
                    resolve(loadedTemplate);
                });
            });
        });
    }
}