import {readFile} from "fs/promises";

const FILE_PATH = 'input.txt';
const SEARCH_PATTERN = /mul\((\d{1,3}),(\d{1,3})\)/gm;

const fileContent = await readFile(FILE_PATH, 'utf-8');

const matches = [...fileContent.matchAll(SEARCH_PATTERN)]
    .map(([match, group1, group2]: any[]) => ([+group1, +group2]));

const result = matches.reduce((acc, [a, b]) => acc + (a * b), 0);

console.log('Result: ', result);
