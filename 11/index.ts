const blink = (engraving) => {
    if (engraving === 0) {
        return [1];
    }
    const engravingString = engraving.toString();
    const length = engravingString.length;
    if (length % 2 === 0) {
        const half = length / 2;
        return [
            Number(engravingString.slice(0, half)),
            Number(engravingString.slice(half))
        ];
    }
    return [engraving * 2024];
};

let stones = [41078, 18, 7, 0, 4785508, 535256, 8154, 447];

for (let i = 0; i < 25; i++) {
    stones = stones.flatMap(s => blink(s));
}

console.log('Part one', stones.length);

const memo = <T extends unknown[], A>(fn: (...args: T) => A) => {
    const cache = new Map();

    return function (...args: T) {
        const key = args.map((arg) => `${arg}_${typeof arg}`).join('|');

        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);

        cache.set(key, result);
        return result;
    };
};

const memoCount = memo((engraving: number, left: number): number => {
    if (left == 0) {
        return 1;
    }
    if (engraving === 0) {
        return memoCount(1, left - 1);
    }
    const engravingString = engraving.toString();
    const length = engravingString.length;
    if (length % 2 === 0) {
        const half = length / 2;
        return memoCount(Number(engravingString.slice(0, half)), left - 1) +
            memoCount(Number(engravingString.slice(half)), left - 1)
    } else {
        return memoCount(engraving * 2024, left - 1);
    }
})

stones = [41078, 18, 7, 0, 4785508, 535256, 8154, 447];

let partTwo =
    stones.map(stone => memoCount(stone, 75))
        .reduce((acc, curr) => acc + curr, 0);
console.log('Part two', partTwo)