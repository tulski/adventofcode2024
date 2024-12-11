import {readFile} from "node:fs/promises";

const nextNorth: NextPositionStrategy = ({x, y}: Coordinates): Coordinates => ({x, y: y - 1});
const nextNorthEast: NextPositionStrategy = ({x, y}: Coordinates): Coordinates => ({x: x + 1, y: y - 1});
const nextEast: NextPositionStrategy = ({x, y}: Coordinates): Coordinates => ({x: x + 1, y});
const nextSouthEast: NextPositionStrategy = ({x, y}: Coordinates): Coordinates => ({x: x + 1, y: y + 1});
const nextSouth: NextPositionStrategy = ({x, y}: Coordinates): Coordinates => ({x, y: y + 1});
const nextSouthWest: NextPositionStrategy = ({x, y}: Coordinates): Coordinates => ({x: x - 1, y: y + 1});
const nextWest: NextPositionStrategy = ({x, y}: Coordinates): Coordinates => ({x: x - 1, y});
const nextNorthWest: NextPositionStrategy = ({x, y}: Coordinates): Coordinates => ({x: x - 1, y: y - 1});

const directions = [nextNorth, nextNorthEast, nextEast, nextSouthEast, nextSouth, nextSouthWest, nextWest, nextNorthWest];

const getLetterAt = (matrix: Matrix, coordinates: Coordinates) => matrix[coordinates.y] ? matrix[coordinates.y][coordinates.x] : null;
const buildFromBottomLeftToTopRight = (matrix: Matrix, center: Coordinates) => {
    return getLetterAt(matrix, nextSouthWest(center)) +
        getLetterAt(matrix, center) +
        getLetterAt(matrix, nextNorthEast(center));
}

const buildFromBottomRightToTopLeft = (matrix: Matrix, center: Coordinates) => {
    return getLetterAt(matrix, nextSouthEast(center)) +
        getLetterAt(matrix, center) +
        getLetterAt(matrix, nextNorthWest(center));
}

const buildFromTopRightToBottomLeft = (matrix: Matrix, center: Coordinates) => {
    return getLetterAt(matrix, nextNorthEast(center)) +
        getLetterAt(matrix, center) +
        getLetterAt(matrix, nextSouthWest(center));
}

const buildFromTopLeftToBottomRight = (matrix: Matrix, center: Coordinates) => {
    return getLetterAt(matrix, nextNorthWest(center)) +
        getLetterAt(matrix, center) +
        getLetterAt(matrix, nextSouthEast(center));
}


const checkDirection = (matrix: Matrix, direction: NextPositionStrategy, startPosition: Coordinates, searchPhrase: string) => {
    let currentPosition = startPosition;
    let currentWord = getLetterAt(matrix, startPosition);
    let currentSearchPhrase = searchPhrase[0];

    while (currentSearchPhrase.length < searchPhrase.length) {
        currentPosition = direction(currentPosition);
        currentWord += getLetterAt(matrix, currentPosition) || "";
        currentSearchPhrase = searchPhrase.substring(0, currentSearchPhrase.length + 1);
        if (currentSearchPhrase !== currentWord) {
            return false;
        }
    }

    return currentWord === searchPhrase;
}

const input = await readFile('input.txt', 'utf-8');
const matrix = input.split('\n').filter(Boolean).map(l => l.trim().split(''));

const searchPhrase = "XMAS";

let partOne = 0;
for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix.length; y++) {
        const curr: Coordinates = {x, y};

        partOne += directions.filter(direction => checkDirection(matrix, direction, curr, searchPhrase)).length;
    }
}
console.log('Part one: ', partOne);


let partTwo = 0;
for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix.length; y++) {
        const curr: Coordinates = {x, y};
        const words = [
            buildFromBottomRightToTopLeft(matrix, curr),
            buildFromBottomLeftToTopRight(matrix, curr),
            buildFromTopRightToBottomLeft(matrix, curr),
            buildFromTopLeftToBottomRight(matrix, curr)
        ];
        const matching = words.filter(w => w === "MAS");
        if (matching.length >= 2) {
            partTwo++;
        }
    }
}
console.log('Part two: ', partTwo);


type Matrix = string[][];

interface Coordinates {
    x: number;
    y: number;
}

type NextPositionStrategy = (coordinates: Coordinates) => Coordinates;
