import {readFile} from "node:fs/promises";
import {valueOf} from "node";

interface Point {
    x: number; // column index
    y: number; // row index
}

const directions: Record<string, Point> = {
    UP: {x: 0, y: 1},
    RIGHT: {x: 1, y: 0},
    DOWN: {x: 0, y: -1},
    LEFT: {x: -1, y: 0}
};

const findTrailToPeak = (from: Point, map: number[][]): Point[] =>
    getPossibleNeighbors(from, map)
        .flatMap((next): Point[] => getPointLevel(next, map) === 9 ? [next] : findTrailToPeak(next, map));

const getPossibleNeighbors = (from: Point, map: number[][]): Point[] =>
    Object.values(directions)
        .map(shift => ({x: from.x + shift.x, y: from.y + shift.y}))
        .filter(({x, y}) => y in map && x in map[y]) // inbound
        .filter(neighbor => getPointLevel(neighbor, map) === getPointLevel(from, map) + 1);

const getPointLevel = (point: Point, map: number[][]) => map[point.y][point.x];

const getUnique = (points: Point[]) => {
    const map = new Map<string, Point>;
    for (const point of points) {
        const key = `${point.x},${[point.y]}`
        map.set(key, point);
    }
    return [...map.values()];
}

const input = await readFile('input.txt', 'utf-8');
const map: number[][] = input
    .split('\n')
    .filter(Boolean)
    .map(line => line.split("").map(Number));
const trailStarts = map.flatMap(
        (line, row): Point[] =>
            line.map((level, column) => level === 0 ? ({x: column, y: row}) : null)
                .filter((el): el is Point => !!el)
    )
;

const partOne = trailStarts
    .map(start => getUnique(findTrailToPeak(start, map)))
    .reduce((acc, trail) => acc + trail.length, 0);
console.log('Part one: ', partOne);

const partTwo = trailStarts
    .map(start => findTrailToPeak(start, map))
    .reduce((acc, trail) => acc + trail.length, 0);
console.log('Part two: ', partTwo);