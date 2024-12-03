import {readFile} from "fs/promises";

const FILE_PATH = 'input.txt';
const PART_ONE_SEARCH_PATTERN = /mul\((\d{1,3}),(\d{1,3})\)/gm;
const PART_TWO_DISABLED_PARTS_PATTERN = /don't\(\)([\s\S]*?)do\(\)/g;

const input = await readFile(FILE_PATH, 'utf-8');

const partOne = (input: string): number => {
    const matches = [...input.matchAll(PART_ONE_SEARCH_PATTERN)]
        .map(([match, group1, group2]: any[]) => ([+group1, +group2]));

    return matches.reduce((acc, [a, b]) => acc + (a * b), 0);
}

const partTwo = (input: string): number => {
    const onlyEnabled = input.replaceAll(PART_TWO_DISABLED_PARTS_PATTERN, '');
    return partOne(onlyEnabled);
}

console.log('Part one: ', partOne(input));
console.log('Part two: ', partTwo(input));
