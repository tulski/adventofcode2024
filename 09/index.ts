import {readFile} from "node:fs/promises";

const input = await readFile('input.txt', 'utf-8');

interface File {
    __type: 'File';
    id: number;
    span: number;
}

const file = (id: number, span: number): File => ({__type: 'File', id, span});

interface FreeSpace {
    __type: 'FreeSpace';
    span: number;
}

const freeSpace = (span: number): FreeSpace => ({__type: 'FreeSpace', span});


type DiskSector = File | FreeSpace;

interface Block {
    __type: DiskSector["__type"];
    id?: number;
}

const explodeToBlocks = (sector: DiskSector) => [...Array(sector.span)].map(_ => ({
    __type: sector.__type,
    ...'id' in sector ? ({id: sector.id}) : ({})
}))

const readDiskMap = (raw: string) => {
    const result: DiskSector[] = [];
    let id = 0;
    for (let i = 0; i < raw.length; i += 2) {
        const fileSpan = Number(raw[i]);
        result.push(file(id++, fileSpan));
        const rawFreeSpaceSpan = raw[i + 1];
        if (rawFreeSpaceSpan) {
            result.push(freeSpace(Number(rawFreeSpaceSpan)))
        }
    }
    return result;
}

const isFreeSpace = (data: DiskSector | Block): data is FreeSpace => data && data.__type === 'FreeSpace';
const isFileBlock = (data: DiskSector | Block): data is File => data && data.__type === 'File';

const compactByMovingBlocks = (diskMap: Block[]) => {
    const map = [...diskMap];

    while (true) {
        const firstFreeSpaceIndex = map.findIndex(el => isFreeSpace(el));
        const lastFileBlockIndex = map.length - 1 - [...map.slice(firstFreeSpaceIndex)].reverse().findIndex(el => isFileBlock(el));

        if (firstFreeSpaceIndex == -1 || lastFileBlockIndex == map.length || firstFreeSpaceIndex > lastFileBlockIndex) {
            return map;
        }
        const firstFreeSpace = map[firstFreeSpaceIndex];
        const lastFileBlock = map[lastFileBlockIndex];
        map[firstFreeSpaceIndex] = lastFileBlock;
        map[lastFileBlockIndex] = firstFreeSpace;
    }
}

const compactByMovingFiles = (sectors: DiskSector[]) => {
    let result = [...sectors];
    const sortedFilesWithIndexes = [...sectors]
        .map((file, index) => ({file, index}) as { file: File, index: number })
        .filter((el) => isFileBlock(el.file))
        .sort((a, b) => b.file.id - a.file.id);

    for (const {file} of sortedFilesWithIndexes) {
        const currentFileIndex = result.findIndex(s => s.id === file.id);
        const matchingFreeSpaceIndex = result.findIndex(s => isFreeSpace(s) && s.span >= file.span);
        if (matchingFreeSpaceIndex < 0 || matchingFreeSpaceIndex > currentFileIndex) {
            continue;
        }
        const matchingFreeSpace = result[matchingFreeSpaceIndex] as FreeSpace;

        result.splice(currentFileIndex,
            1,
            freeSpace(file.span)
        );
        result.splice(matchingFreeSpaceIndex,
            1,
            file,
            freeSpace(matchingFreeSpace.span - file.span)
        );
        result = result.filter(el => el.span > 0);
        // join two connected free spaces
        result = result.reduce((acc, curr) => {
            if (isFreeSpace(acc[acc.length - 1]) && isFreeSpace(curr)) {
                acc[acc.length - 1] = freeSpace(acc[acc.length - 1].span + curr.span);
                return acc;
            } else {
                acc.push(curr);
                return acc;
            }
        }, [] as DiskSector[]);
    }
    return result;
}

const calculateChecksum = (diskMap: Block[]) => {
    return diskMap
        .reduce((acc, block, blockIndex) => acc + (blockIndex * (block.id || 0)), 0)
}

const diskMap = readDiskMap(input);
const partOneBlocks = diskMap.flatMap(sector => explodeToBlocks(sector));
const partOneCompactedBlocks = compactByMovingBlocks(partOneBlocks);
const partOne = calculateChecksum(partOneCompactedBlocks);
console.log('Part one: ', partOne);

const partTwoCompactedByFiles = compactByMovingFiles(diskMap);
const partTwoBlocks = partTwoCompactedByFiles.flatMap(sector => explodeToBlocks(sector));
const partTwo = calculateChecksum(partTwoBlocks);
console.log('Part two: ', partTwo);