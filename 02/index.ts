import {readFile} from "node:fs/promises";

const FILE_PATH = 'input.txt';

const input = await readFile(FILE_PATH, 'utf-8');

const isValidLine = (rawInput: string): boolean => !!rawInput.trim();
const parseLineToReport = (rawReport: string): number[] => rawReport.trim().split(' ').map(el => Number(el));

const atLeastOneAndAtMostThree = (val: number): boolean => Math.abs(val) >= 1 && Math.abs(val) <= 3;
const sameSign = (a: number, b: number): boolean => Math.sign(a) === Math.sign(b);
const isSafe = (report: number[]) => {
    let previousDiff = null;
    for (let i = 1; i < report.length; i++) {
        const left = report[i - 1];
        const right = report[i];
        const diff = left - right;
        if (!atLeastOneAndAtMostThree(Math.abs(diff))) {
            return false;
        }
        if (previousDiff && !sameSign(previousDiff, diff)) {
            return false;
        }
        previousDiff = diff;
    }
    return true;
}

const explode = (report: number[]) => {
    return [...Array(report.length).keys()].map(indexToRemove =>
        report.filter((v, idx) => idx !== indexToRemove));
}

const isSafeWithOneLevelTolerance = (report: number[]) => {
    return [report, ...explode(report)].some(r => isSafe(r));
}

const reports = input.split('\n')
    .filter(rawInput => isValidLine(rawInput))
    .map((rawReport) => parseLineToReport(rawReport));

const partOne = reports.filter((report) => isSafe(report));
const partTwo = reports.filter((report) => isSafeWithOneLevelTolerance(report));

console.log('Part one: ', partOne.length);
console.log('Part two: ', partTwo.length);
