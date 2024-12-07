enum Direction {
    N = 'N',
    NE = 'NE',
    E = 'E',
    SE = 'SE',
    S = 'S',
    SW = 'SW',
    W = 'W',
    NW = 'NW'
}

interface Cell {
    value: string;
    x: number;
    y: number;
}

interface Grid {
    cells: Cell[][];
    height: number;
    width: number;
}


function neighbor_get(
        grid: Grid, cell: Cell, direction: Direction): Cell | null {
    switch (direction) {
        case Direction.N:
            if (cell.y === 0) { break; }

            return grid.cells[cell.y - 1][cell.x];
        case Direction.NE:
            if (cell.x === grid.width || cell.y === 0) { break; }

            return grid.cells[cell.y - 1][cell.x + 1];
        case Direction.E:
            if (cell.x === grid.width) { break; }

            return grid.cells[cell.y][cell.x + 1];
        case Direction.SE:
            if (cell.x === grid.width || cell.y === grid.height) { break; }

            return grid.cells[cell.y + 1][cell.x + 1];
        case Direction.S:
            if (cell.y === grid.height) { break; }

            return grid.cells[cell.y + 1][cell.x];
        case Direction.SW:
            if (cell.x === 0 || cell.y === grid.height) { break; }

            return grid.cells[cell.y + 1][cell.x - 1];
        case Direction.W:
            if (cell.x === 0) { break; }

            return grid.cells[cell.y][cell.x - 1];
        case Direction.NW:
            if (cell.x === 0 || cell.y === 0) { break; }

            return grid.cells[cell.y - 1][cell.x - 1];
        default:
            throw new Error('Invalid grid coordinate');
    }

    return null;
}

function neighbor_search(
        grid: Grid, cell: Cell, direction: Direction, word: string): boolean {
    if (cell.value !== word[0]) { return false; }
    if (word.length === 1) { return true; }

    const neighbor = neighbor_get(grid, cell, direction);
    if (neighbor === null) { return false; }

    return neighbor_search(grid, neighbor, direction, word.slice(1));
}

function word_search(grid: Grid, start: Cell, word:string): number {
    let matches = 0;

    for (const direction of Object.values(Direction)) {
        if (neighbor_search(grid, start, direction, word)) {
            ++matches;
        }
    }

    return matches;
}


function first(data: string): void {
    let result = 0;

    const grid: Grid = {
        cells: [],
        height: 0,
        width: 0};
    const starts: Cell[] = [];

    for (const [y, line] of data.split('\n').entries()) {
        const row: Cell[] = [];

        for (const [x, character] of line.split('').entries()) {
            const cell: Cell = {
                value: character,
                x: x,
                y: y};

            if (character === 'X') {
                starts.push(cell);
            }

            row.push(cell);
        }

        grid.cells.push(row);
    }

    grid.height = grid.cells.length - 1;
    grid.width = grid.cells[0].length - 1;

    for (const start of starts) {
        result += word_search(grid, start, 'XMAS');
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    let result = 0;

    console.log(`[.] Solution: ${result}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then(data => {
        data = data.trim();

        if (part === 1) {
            first(data);
        } else {
            second(data);
        }
    });
}

