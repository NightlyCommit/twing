class TwingTestMagicCallStub {
    public toString: any = '';

    __call() {
        throw new Error('__call shall not be called');
    }
}

export default TwingTestMagicCallStub;