enum Direction {
    N = 'N',
    E = 'E',
    S = 'S',
    W = 'W'
}

interface Grid {
    heads: Head[];
    height: number;
    tiles: Tile[][];
    width: number;
}

interface Head {
    tails: Map<Tile, number>;
    tile: Tile;
}

interface Tile {
    elevation: number;
    x: number;
    y: number;
}


function grid_parse(data: string): Grid {
    const grid: Grid = {
        heads: [],
        height: -1,
        tiles: [],
        width: -1};

    for (const [y, line] of data.split('\n').entries()) {
        const row: Tile[] = [];

        for (const [x, character] of line.split('').entries()) {
            const tile: Tile = {
                elevation: parseInt(character, 10),
                x: x,
                y: y};

            if (tile.elevation === 0) {
                grid.heads.push({
                    tails: new Map(),
                    tile: tile});
            }

            row.push(tile);
        }

        grid.tiles.push(row);
    }

    grid.height = grid.tiles.length - 1;
    grid.width = grid.tiles[0].length - 1;

    return grid;
}

function head_walk(grid: Grid, head: Head, tile: Tile): void {
    if (tile.elevation === 9) {
        const rating = head.tails.get(tile);
        if (rating === undefined) {
            head.tails.set(tile, 1);
        } else {
            head.tails.set(tile, rating + 1);
        }
    } else {
        for (const direction of Object.values(Direction)) {
            const neighbor = neighbor_get(grid, tile, direction);
            if (neighbor === null) { continue; }
            if (neighbor.elevation - tile.elevation !== 1) { continue; }

            head_walk(grid, head, neighbor);
        }
    }
}

function neighbor_get(
        grid: Grid, tile: Tile, direction: Direction): Tile | null {
    switch (direction) {
        case Direction.N:
            if (tile.y === 0) { break; }

            return grid.tiles[tile.y - 1][tile.x];
        case Direction.E:
            if (tile.x === grid.width) { break; }

            return grid.tiles[tile.y][tile.x + 1];
        case Direction.S:
            if (tile.y === grid.height) { break; }

            return grid.tiles[tile.y + 1][tile.x];
        case Direction.W:
            if (tile.x === 0) { break; }

            return grid.tiles[tile.y][tile.x - 1];
        default:
            throw new Error('Invalid grid coordinate');
    }

    return null;
}


function first(grid: Grid): void {
    let result = 0;

    for (const head of grid.heads) {
        head_walk(grid, head, head.tile);

        result += head.tails.size;
    }

    console.log(`[.] Solution: ${result}`);
}

function second(grid: Grid): void {
    let result = 0;

    for (const head of grid.heads) {
        head_walk(grid, head, head.tile);

        result += head.tails.values()
            .reduce((accumulator, value) => accumulator + value);
    }


    console.log(`[.] Solution: ${result}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then((data) => {
        data = data.trim();

        const grid = grid_parse(data);

        if (part === 1) {
            first(grid);
        } else {
            second(grid);
        }
    });
}

