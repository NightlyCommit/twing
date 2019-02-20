import {TwingTest} from '../../../../../build';

new TwingTest('foo', () => {}, {
    alternative: new TwingTest('alternative')
});
