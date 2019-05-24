import {TwingTest} from '../../../../../build/test';

new TwingTest('foo', () => {}, {
    alternative: new TwingTest('alternative')
});
