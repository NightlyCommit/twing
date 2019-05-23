import {TwingFunction} from '../../../../../build/function';

new TwingFunction('foo', () => {}, {
    alternative: new TwingFunction('alternative')
});
