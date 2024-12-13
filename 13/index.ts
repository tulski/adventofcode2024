// credits to ThunderChaser
// https://www.reddit.com/r/adventofcode/comments/1hd7irq/2024_day_13_an_explanation_of_the_mathematics/

import {readFile} from "node:fs/promises";

interface Machine {
    A: [number, number];
    B: [number, number];
    Prize: [number, number];
}

type Point = [number, number];

const price = {
    a: 3,
    b: 1
}


const solveMachine = (machine: Machine, offset: number = 0) => {
    // A - numer of times we press A
    // B - numer of times we press B

    // A*a_x + B*B_x = p_x
    // A*a_y + B*b_y = p_y
    const [A_x, A_y] = machine.A;
    const [B_x, B_y] = machine.B;
    const [P_x, P_y] = machine.Prize;


    const det = A_x * B_y - A_y * B_x;
    if (det === 0) return 0; // no solution

    const [prize_x, prize_y] = [P_x + offset, P_y + offset];
    const a = (prize_x * B_y - prize_y * B_x) / det;
    const b = (A_x * prize_y - A_y * prize_x) / det;

    if (
        Number.isInteger(a) &&
        Number.isInteger(b) &&
        a >= 0 &&
        b >= 0 &&
        A_x * a + B_x * b === prize_x &&
        A_y * a + B_y * b === prize_y
    ) {
        return price.a * a + price.b * b;
    }
    return 0;
}

const machines: Machine[] = [];

const input = await readFile('input.txt', 'utf-8');
const lines = input.split("\n").filter(Boolean);
for (let i = 0; i < lines.length; i += 3) {
    const buttonALine = lines[i].match(/X\+(-?\d+), Y\+(-?\d+)/);
    const buttonBLine = lines[i + 1].match(/X\+(-?\d+), Y\+(-?\d+)/);
    const prizeLine = lines[i + 2].match(/X=(-?\d+), Y=(-?\d+)/);

    if (buttonALine && buttonBLine && prizeLine) {
        machines.push({
            A: [buttonALine[1], buttonALine[2]].map(Number),
            B: [buttonBLine[1], buttonBLine[2]].map(Number),
            Prize: [prizeLine[1], prizeLine[2]].map(Number)
        });
    }
}

console.log('Part 1:', machines.map(el => solveMachine(el)).reduce((acc, v) => acc + v, 0));
console.log('Part 2:', machines.map(el => solveMachine(el, 10000000000000)).reduce((acc, v) => acc + v, 0));