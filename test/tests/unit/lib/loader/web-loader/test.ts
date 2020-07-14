import * as tape from 'tape';
import {TwingWebLoader} from "../../../../../../src/lib/loader/web-loader";
import { TwingEnvironment } from '../../../../../../src/main';

//demo data
const template = `
<!doctype>
<html>
    <head></head>
    <body>
        shouldBeTemplate1[{% include 'template1.twing' %}]
        shouldBeTemplate2[{% include 'template2.twing' %}]
        shouldNotKnowTemplate3[{% include 'template3.twing' %}]
        templateWithSub[{% include 'templateWithSub.twing' %}]
        ping[{{ pong }}]
    </body>
</html>
`;
const data = {pong:'pong'};
const webLoader = (path:string)=>{
    return new Promise<string>((resolve)=>{
        switch(path){
            case 'template1.twing':
                resolve('template1 loaded');
                break;
            case 'template2.twing':
                resolve('template2 loaded');
                break;
            case 'templateWithSub.twing':
                resolve('templateWithSub loaded [{% include "templateSub.twing" %}]');
                break;
            case 'templateSub.twing':
                resolve('sub template loaded');
                break;
            default:
                resolve('dont know this template');
        }
    });
}
let loader = TwingWebLoader.getNewInstance(webLoader,template,data);

tape('loader web loader', (test) => {
    test.test('templates loaded', (test) => {
        loader((loader)=>{
            test.true(loader.exists('template1.twing', null));
            test.true(loader.exists('template2.twing', null));
            test.true(loader.exists('templateWithSub.twing', null));
            test.true(loader.exists('templateSub.twing', null));
            test.true(loader.exists('template3.twing', null)); //template3.twing should exist since it's in the main template but will display (in this case) dont know this template to the user
            test.false(loader.exists('template4.twing', null)); 

            test.end();
        });
    });

    test.test('templates output', (test) =>{
        loader((loader)=>{
            var env = new TwingEnvironment(loader);
            test.true(env.createTemplate(template, 'main').render(data).replace(/\s/g,'') == '<!doctype><html><head></head><body>shouldBeTemplate1[template1loaded]shouldBeTemplate2[template2loaded]shouldNotKnowTemplate3[dontknowthistemplate]templateWithSub[templateWithSubloaded[subtemplateloaded]]ping[pong]</body></html>');

            test.end();
        });
    });

    test.end();
});
