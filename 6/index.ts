import {readFile} from "node:fs/promises";

const input = await readFile('input.txt', 'utf-8');

const enum Direction {
    Up = 'UP',
    Down = 'DOWN',
    Left = 'LEFT',
    Right = 'RIGHT',
}

const RotateClockwise = {
    [Direction.Up]: Direction.Right,
    [Direction.Right]: Direction.Down,
    [Direction.Down]: Direction.Left,
    [Direction.Left]: Direction.Up,
};


const enum PlayingField {
    EMPTY = ".",
    OBSTRUCTION = "#",
}

class Coordinates {

    constructor(
        public readonly row: number,
        public readonly column: number
    ) {
    }

    up(): Coordinates {
        return new Coordinates(this.row - 1, this.column);
    }

    down(): Coordinates {
        return new Coordinates(this.row + 1, this.column);
    }

    left(): Coordinates {
        return new Coordinates(this.row, this.column - 1);
    }

    right(): Coordinates {
        return new Coordinates(this.row, this.column + 1);
    }

    move(direction: Direction): Coordinates {
        switch (direction) {
            case Direction.Up:
                return this.up();
            case Direction.Down:
                return this.down();
            case Direction.Left:
                return this.left();
            case Direction.Right:
                return this.right();
        }
    }

    equals(other: Coordinates): boolean {
        return this.row === other.row && this.column === other.column;
    }
}

class Guard {
    constructor(
        public readonly position: Coordinates,
        public readonly direction: Direction
    ) {
    }

    public play(playingField: PlayingField): Guard {
        // If there is something directly in front of you, turn right 90 degrees.
        // Otherwise, take a step forward.
        if (playingField == PlayingField.OBSTRUCTION) {
            return this.rotateClockwise();
        }
        if (playingField == PlayingField.EMPTY) {
            return this.moveForward();
        }
        throw new Error("Ups")
    }

    public get nextMove(): Coordinates {
        return this.position.move(this.direction);
    }

    private moveForward(): Guard {
        return new Guard(this.nextMove, this.direction);
    }


    private rotateClockwise(): Guard {
        return new Guard(this.position, RotateClockwise[this.direction]);
    }

    public equals(other: Guard): boolean {
        return this.position.equals(other.position) &&
            this.direction === other.direction;
    }
}

class Game {
    static play(map: PlayingField[][], guard: Guard) {
        const history: Guard[] = [guard];

        let timeParadox = false;

        while (true) {
            const guard = history.at(-1);

            const nextMovePosition = guard.nextMove;
            const nextMoveField = map[nextMovePosition.row] ? map[nextMovePosition.row][nextMovePosition.column] : undefined;

            if (!nextMoveField) { // outer wall
                return {timeParadox: false, history}
            }

            const movedGuard = guard.play(nextMoveField);
            const guardHasDejaVu = history.find(h => h.equals(movedGuard))

            if (guardHasDejaVu) {
                return {timeParadox: true, history};
            }

            history.push(movedGuard);
        }

        return {timeParadox, history};
    }
}

const loadInput = (rawFields: string[][]) => {
    const map: PlayingField[][] = [];
    let guard: Guard;

    for (let i = 0; i < rawFields.length; i++) {
        map[i] = [];
        for (let j = 0; j < rawFields[i].length; j++) {
            const val = rawFields[i][j];
            if (val == PlayingField.EMPTY) {
                map[i][j] = PlayingField.EMPTY;
            }
            if (val === PlayingField.OBSTRUCTION) {
                map[i][j] = PlayingField.OBSTRUCTION;
            }
            if (rawFields[i][j] === "^") {
                const location = new Coordinates(i, j);
                guard = new Guard(location, Direction.Up);
                map[i][j] = PlayingField.EMPTY;
            }
        }
    }

    return {map, guard};
}

const rawFields = input.split('\n').map(line => line.trim().split("")).filter(el => el.length > 0);

const {map, guard} = loadInput(rawFields);
const history = Game.play(map, guard).history;

const uniquePlaces = new Set(history.map(g => `${g.position.row},${g.position.column}`));
console.log('Part one: ', uniquePlaces.size);

