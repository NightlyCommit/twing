import {TwingFunction} from '../../../../../build/index';

new TwingFunction('foo', () => {}, {
    alternative: new TwingFunction('alternative')
});
