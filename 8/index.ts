import {readFile} from "node:fs/promises";

type AntennaMap = Record<string, Point[]>;

type Point = [number, number];

type InputMap = string[][];

const buildAntennaMap = (inputMap: InputMap): AntennaMap => {
    const antennaMap: AntennaMap = {};
    inputMap.forEach((row, y) => {
        row.forEach((frequency, x) => {
            if (frequency !== '.') {
                if (!antennaMap[frequency]) {
                    antennaMap[frequency] = [];
                }
                antennaMap[frequency].push([x, y]);
            }
        });
    });
    return antennaMap;
}

const range = (min: number, max: number) => [...Array(max - min + 1)].map((_, i) => min + i);

const isValid = (point: Point) => Number.isInteger(point[0]) && Number.isInteger(point[1]);
const isInBound = (point: Point, width: number, height: number) =>
    0 <= point[0] && point[0] < width &&
    0 <= point[1] && point[1] < height;

const findAntinodes = (
    antennaMap: AntennaMap,
    width: number,
    height: number,
    minDistanceMultiplier: number,
    maxDistanceMultiplier: number
): Point[] => {
    const antinodesMap: Map<any, any> = new Map<string, Point>();

    Object.values(antennaMap).forEach((positions) => {
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                for (let multiplier in range(minDistanceMultiplier, maxDistanceMultiplier)) {
                    const [x1, y1] = positions[i];
                    const [x2, y2] = positions[j];

                    const dx = x2 - x1;
                    const dy = y2 - y1;

                    const antinode1: Point = [x1 - (dx * multiplier), y1 - (dy * multiplier)];
                    const antinode2: Point = [x2 + (dx * multiplier), y2 + (dy * multiplier)];

                    if (isValid(antinode1) && isInBound(antinode1, width, height)) {
                        const key = `${antinode1[0]},${antinode1[1]}`;
                        antinodesMap.set(key, antinode1);
                    }
                    if (isValid(antinode2) && isInBound(antinode2, width, height)) {
                        const key = `${antinode2[0]},${antinode2[1]}`;
                        antinodesMap.set(key, antinode2);
                    }
                }
            }
        }
    });

    return [...antinodesMap.values()];
}

const countUniqueAntinodes = (inputMap: InputMap, minDistanceMultiplier: number, maxDistanceMultiplier: number): number => {
    const width = inputMap[0].length;
    const height = inputMap.length;
    const antennaMap = buildAntennaMap(inputMap);
    const antinodes = findAntinodes(antennaMap, width, height, minDistanceMultiplier, maxDistanceMultiplier);
    return antinodes.length;
}

// Example usage
const inputMap = (await readFile('input.txt', 'utf-8'))
    .split("\n")
    .map(line => line.trim().split(""))
    .filter(row => row.length > 0);

console.log('Part one: ', countUniqueAntinodes(inputMap, 1, 2));
console.log('Part two: ', countUniqueAntinodes(inputMap, 0, inputMap.length));
