import {TwingTest} from '../../../../../build/main';

new TwingTest('foo', () => {
    return null;
}, {
    alternative: new TwingTest('alternative')
});
