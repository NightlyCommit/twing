import {TwingTest} from '../../../../../build/index';

new TwingTest('foo', () => {}, {
    alternative: new TwingTest('alternative')
});
