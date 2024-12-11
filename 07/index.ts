import {readFile} from "node:fs/promises";

type Operator = (a: number, b: number) => number;

const add: Operator = (a, b) => a + b;
const multiply: Operator = (a, b) => a * b;
const concatenate: Operator = (a, b) => Number(`${a}${b}`);

const generateCombinations = <T>(elements: T[], length: number): T[][] => {
    const combinations = [];

    const backtrack = (currentCombination: T[]) => {
        if (currentCombination.length === length) {
            combinations.push([...currentCombination]);
            return;
        }
        for (const element of elements) {
            currentCombination.push(element);
            backtrack(currentCombination);
            currentCombination.pop();
        }
    };

    backtrack([]);
    return combinations;
}

type Equation = (number | Operator)[];

const buildPossibleEquations = (terms: number[], operators: Operator[]): Equation[] => {
    const operatorsCombinations = generateCombinations(operators, terms.length - 1);
    const equations: Equation[] = [];
    for (const operators of operatorsCombinations) {
        const equation = terms.flatMap((term, i) => [term, operators[i]].filter(Boolean))
        equations.push(equation);
    }
    return equations;
}

const evaluate = (equation: Equation): number => {
    let result = equation[0] as number;
    for (let i = 1; i < equation.length; i += 2) {
        const operator = equation[i] as Operator;
        const nextNumber = equation[i + 1] as number;

        result = operator(result, nextNumber);
    }
    return result;
}

interface InputEquation {
    testValue: number,
    numbers: number[]
}

const parse = (line: string): InputEquation => {
    const [rawTestValue, rawNumbers] = line.trim().split(":");
    const numbers = rawNumbers.trim().split(" ").filter(Boolean).map(el => Number(el));
    return {testValue: Number(rawTestValue), numbers}
}

const testIfPotentiallyTrue = (input: InputEquation, operators: Operator[]) => {
    return buildPossibleEquations(input.numbers, operators)
        .some((equationElements) => evaluate(equationElements) === input.testValue)
}

const input = await readFile('input.txt', 'utf-8');

const inputEquations = input.split('\n').filter(Boolean).map(line => parse(line));

const partOne = inputEquations
    .filter(eq => testIfPotentiallyTrue(eq, [add, multiply]))
    .reduce((acc, equation) => acc + equation.testValue, 0);
console.log('Part one: ', partOne);

const partTwo = inputEquations
    .filter(eq => testIfPotentiallyTrue(eq, [add, multiply, concatenate]))
    .reduce((acc, equation) => acc + equation.testValue, 0);
console.log('Part one: ', partTwo);
