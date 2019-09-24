import {TwingTest} from '../../../../../build/main';

new TwingTest('foo', () => {
    return true;
}, [], {
    alternative: new TwingTest('alternative', () => {
        return true
    }, [])
});
