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


function neighbor_get(grid: Grid, cell: Cell, direction: Direction): Cell {
    switch (direction) {
        case Direction.N:
            return grid.cells[cell.y - 1][cell.x];
        case Direction.NE:
            return grid.cells[cell.y - 1][cell.x + 1];
        case Direction.E:
            return grid.cells[cell.y][cell.x + 1];
        case Direction.SE:
            return grid.cells[cell.y + 1][cell.x + 1];
        case Direction.S:
            return grid.cells[cell.y + 1][cell.x];
        case Direction.SW:
            return grid.cells[cell.y + 1][cell.x - 1];
        case Direction.W:
            return grid.cells[cell.y][cell.x - 1];
        case Direction.NW:
            return grid.cells[cell.y - 1][cell.x - 1];
        default:
            throw new Error('Invalid grid coordinate');
    }
}

function neighbors_get(
        grid: Grid, cell: Cell, direction: Direction | null): Map<Direction, Cell> {
    const limit_east = grid.width - 1;
    const limit_south = grid.height - 1;

    const directions: Map<Direction, boolean> = new Map([
         [Direction.N, cell.y !== 0],
        [Direction.NE, cell.x !== limit_east && cell.y !== 0],
         [Direction.E, cell.x !== limit_east],
        [Direction.SE, cell.x !== limit_east && cell.y !== limit_south],
         [Direction.S, cell.y !== limit_south],
        [Direction.SW, cell.x !== 0 && cell.y !== limit_south],
         [Direction.W, cell.x !== 0],
        [Direction.NW, cell.x !== 0 && cell.y !== 0]]);

    const neighbors: Map<Direction, Cell> = new Map();
    if (direction === null) {
        for (const [key, valid] of directions) {
            if (valid === true) {
                neighbors.set(key, neighbor_get(grid, cell, key));
            }
        }
    } else if (directions.get(direction) === true) {
        neighbors.set(direction, neighbor_get(grid, cell, direction));
    }

    return neighbors;
}

function neighbors_search(grid: Grid, cell: Cell, word: string): number {
    let matches = 0;

    const neighbors = neighbors_get(grid, cell, null);
    for (const [direction, neighbor] of neighbors) {
        if (word_search(grid, neighbor, direction, word)) {
            ++matches;
        }
    }

    return matches;
}

function word_search(
        grid: Grid, cell: Cell, direction: Direction, word: string): boolean {
    if (cell.value !== word[0]) { return false; }
    if (word.length === 1) { return true; }

    const neighbors = neighbors_get(grid, cell, direction);

    const neighbor = neighbors.get(direction);
    if (neighbor === undefined) { return false; }

    return word_search(grid, neighbor, direction, word.slice(1));
}


function first(grid: Grid): void {
    let result = 0;

    for (const row of grid.cells) {
        for (const cell of row) {
            if (cell.value === 'X') {
                result += neighbors_search(grid, cell, 'MAS');
            }
        }
    }

    console.log(`[.] Solution: ${result}`);
}

function second(grid: Grid): void {
    let result = 0;

    console.log(`[.] Solution: ${result}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then(data => {
        data = data.trim();

        const grid: Grid = {
            cells: [],
            height: 0,
            width: 0};
        for (const [y, line] of data.split('\n').entries()) {
            grid.cells.push(line.split('')
                .map((character, x) => ({value: character, x: x, y: y})));
        }

        grid.height = grid.cells.length;
        grid.width = grid.cells[0].length;

        if (part === 1) {
            first(grid);
        } else {
            second(grid);
        }
    });
}

