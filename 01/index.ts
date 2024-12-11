import {readFile} from "node:fs/promises";

const input = await readFile('input.txt', 'utf-8');

const parseLine = (line: string) => line.split(' ').filter(el => el != '').map(el => +el);

const aggregateTwoLists = (acc: TwoLists, currNumbers: number[]): TwoLists => ([
    [...acc[0], currNumbers[0]],
    [...acc[1], currNumbers[1]],
]);

const sortBoth = (left: number[], right: number[]) => ({left: left.sort(), right: right.sort()});

const zip = <T, K>(list1: T[], list2: K[]): [T, K][] =>
    [...Array(Math.min(list1.length, list2.length)).keys()]
        .map(i => [list1[i], list2[i]]);

const calcDistance = (pair: [number, number]) => Math.abs(pair[0] - pair[1]);

const partOne = (left: number[], right: number[]): number => {
    const sortedLeft = left.sort();
    const sortedRight = right.sort();
    const pairs = zip(sortedLeft, sortedRight);
    return pairs.map(pair => calcDistance(pair)).reduce((acc, curr) => acc + curr, 0);
}

const countOccurrences = <T>(arr: T[], search: T) => arr.filter(el => el === search).length;


const partTwo = (left: number[], right: number[]): number => {
    return left
        .map((leftEl => leftEl * countOccurrences(right, leftEl)))
        .reduce((acc, curr) => acc + curr, 0);
}

const [leftList, rightList] = input.split('\n')
    .filter(Boolean)
    .map(line => parseLine(line))
    .reduce((acc, curr) => aggregateTwoLists(acc, curr), [[], []] as TwoLists)


console.log('Part one: ', partOne(leftList, rightList));
console.log('Part two: ', partTwo(leftList, rightList));


type TwoLists = [number[], number[]];
