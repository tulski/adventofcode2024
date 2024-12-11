import {readFile} from "node:fs/promises";
import {ftruncate} from "node:fs";

interface OrderingRule {
    isSatisfiedBy(numbers: number[]): boolean;
}

class OneBeforeAnother implements OrderingRule {
    constructor(
        readonly before: number,
        readonly after: number,
    ) {
    }

    isSatisfiedBy(numbers: number[]) {
        return !numbers.includes(this.before)
            || !numbers.includes(this.after)
            || numbers.indexOf(this.before) < numbers.indexOf(this.after);
    }
}

class MiddlePageNumber {
    static of(update: number[]): number {
        return update[Math.round((update.length - 1) / 2)];
    }
}

class EveryRule implements OrderingRule {

    constructor(
        private readonly rules: OrderingRule[]
    ) {
    }

    isSatifiedBy(numbers: number[]) {
        return rules.every(rule => rule.isSatisfiedBy(numbers));
    }
}

const input = await readFile('input.txt', 'utf-8');
const inputLines = input.split('\n').map(el => el.trim()).filter(Boolean);

const rules = inputLines
    .map(l => l.split('|'))
    .filter(el => el.length > 1)
    .map(el => new OneBeforeAnother(Number(el[0]), Number(el[1])));

const everyOrderingRule = new EveryRule(rules);

const updates = inputLines
    .map(l => l.split(',').map(e => Number(e)).filter(Boolean))
    .filter(el => el.length > 1);

const partOne = updates
    .filter(update => everyOrderingRule.isSatifiedBy(update))
    .map(update => MiddlePageNumber.of(update))
    .reduce((acc, curr) => acc + curr, 0);

console.log('Part one: ', partOne); // 6267


const reorderUpdate = (update: number[]): number[] => {
    const dependencies = new Map<number, Set<number>>();
    const inDegree = new Map<number, number>();

    // Initialize maps
    update.forEach(page => {
        dependencies.set(page, new Set());
        inDegree.set(page, 0);
    });

    // Build dependency graph
    for (const rule of rules) {
        const x = rule.before;
        const y = rule.after;
        if (dependencies.has(x) && dependencies.has(y)) {
            dependencies.get(x)!.add(y);
            inDegree.set(y, (inDegree.get(y) || 0) + 1);
        }
    }

    // Topological sort
    const queue: number[] = [];
    for (const [page, degree] of inDegree.entries()) {
        if (degree === 0) queue.push(page);
    }

    const sorted: number[] = [];
    while (queue.length > 0) {
        const current = queue.shift()!;
        sorted.push(current);

        for (const neighbor of dependencies.get(current)!) {
            inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
            if (inDegree.get(neighbor) === 0) queue.push(neighbor);
        }
    }

    return sorted;
}

const partTwo = updates
    .filter(updates => !everyOrderingRule.isSatifiedBy(updates))
    .map((update, index) => {
        const reordered = reorderUpdate(update);
        return MiddlePageNumber.of(reordered);
    })
    .reduce((acc, curr) => acc + curr, 0);

console.log('Part two ', partTwo); // 5184
