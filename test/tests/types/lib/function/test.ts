import {TwingFunction} from '../../../../../build';

new TwingFunction('foo', () => {}, {
    alternative: new TwingFunction('alternative')
});
