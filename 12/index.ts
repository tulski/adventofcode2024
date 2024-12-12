import {readFileSync} from "fs";

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

interface DirectionalPoint {
    x: number;
    y: number;
    direction: keyof typeof directions;
}

const mapPointToString = ({x, y}: Point) => `${x},${y}`;

const getValue = (map: string[][], point: Point) => map[point.y]?.[point.x];

const getNeighbors = (map: string[][], from: Point) =>
    Object.entries(directions)
        .map(([direction, shift]) => ({x: from.x + shift.x, y: from.y + shift.y, direction}))

const findRegion = (map: string[][], fromPoint: Point) => {
    const queue = [fromPoint];
    const area = [fromPoint];
    const perimeter: DirectionalPoint[] = [];
    const seen = new Set<string>();
    const type = getValue(map, fromPoint);

    while (queue.length) {
        const current = queue.shift()!;
        seen.add(mapPointToString(current));


        getNeighbors(map, current).forEach(
            (neighbor) => {
                if (seen.has(mapPointToString(neighbor))) {
                    return;
                }
                const neighborType = getValue(map, neighbor);
                console.log('neighborType', neighborType, type)
                if (neighborType && type === neighborType) {
                    area.push(neighbor);
                    queue.push(neighbor);
                    seen.add(mapPointToString(neighbor));
                } else {
                    perimeter.push(neighbor);
                }
            }
        );
    }
    return {
        type,
        area,
        perimeter
    };
};

const map = readFileSync('input.txt', 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map((l) => l.split(''));

const seen = new Set();
const regions = [];

map.forEach((el, row) => {
    el.forEach((_, column) => {
        const point = {x: column, y: row};
        if (seen.has(mapPointToString(point))) {
            return;
        }
        const region = findRegion(map, point);
        regions.push(region);
        region.area.forEach((p) => seen.add(mapPointToString(p)));
    });
});

console.log(
    'Part one',
    regions.reduce((acc, c) => acc + c.area.length * c.perimeter.length, 0)
);