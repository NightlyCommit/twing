class TwingMap<K, V> extends Map<any, any> {
    // constructor(iterable: [any, any][] = null) {
    //     super(iterable);
    // }

    push(item: any) {
        this.set(this.length(), item);

        return this;
    }

    length(): number {
        return Array.from(this.values()).length;
    }

    first() {
        return Array.from(this.values())[0];
    }

    sortByKey() {
        let self = this;
        let sortedKeys = Array.from(this.keys()).sort();
        let sortedMap = new Map();

        sortedKeys.forEach(function (key) {
            sortedMap.set(key, self.get(key));
        });

        this.clear();

        sortedMap.forEach(function (value, key) {
            self.set(key, value);
        });
    }

    merge(map: TwingMap<any, any>) {
        let self = this;
        let result = new TwingMap();

        self.forEach(function (value, key) {
           result.set(key, value);
        });

        map.forEach(function(value, key) {
            result.set(key, value);
        });

        return result;
    }
}

export default TwingMap;