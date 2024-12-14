import {readFile} from "node:fs/promises";

const seconds = 100;
const width = 101;
const height = 103;
const midWidth = Math.floor(width / 2);
const midHeight = Math.floor(height / 2);

const input = await readFile('input.txt', 'utf-8');

const robots = input
    .split("\n")
    .filter(Boolean)
    .map(line => ({
        p: line.trim().split(" ")[0].substring(2).split(",").map(Number),
        v: line.trim().split(" ")[1].substring(2).split(",").map(Number)
    }));

const moveInTime = (robot) => {
    const [vx, vy] = robot.v;
    let [x, y] = robot.p;
    for (let second = 0; second < seconds; second++) {
        x = (x + vx + width) % width;
        y = (y + vy + height) % height
    }
    return [x, y];
}

let topLeft = 0;
let topRight = 0;
let bottomRight = 0;
let bottomLeft = 0;

for (const robot of robots) {
    const [final_x, final_y] = moveInTime(robot);
    if (final_x < midWidth && final_y < midHeight) {
        topLeft++;
    } else if (final_x > midWidth && final_y < midHeight) {
        topRight++;
    } else if (final_x > midWidth && final_y > midHeight) {
        bottomRight++
    } else if (final_x < midWidth && final_y > midHeight) {
        bottomLeft++;
    }
}

console.log('Part one', topLeft * topRight * bottomRight * bottomLeft);


let partTwoTime = 0;

while (true) {
    partTwoTime++;

    for (let i = 0; i < robots.length; i++) {
        const robot = robots[i];
        const [vx, vy] = robot.v;
        const x = (robot.p[0] + vx + width) % width;
        const y = (robot.p[1] + vy + height) % height
        robot.p = [x, y];
    }

    const robotsPositions = robots.map(el => el.p.join(','));
    if (new Set(robotsPositions).size === robotsPositions.length) {
        break;
    }
}

console.log('Part two: ', partTwoTime);