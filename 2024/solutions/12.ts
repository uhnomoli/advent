enum Direction {
    N = 'N',
    E = 'E',
    S = 'S',
    W = 'W',
}

interface Grid {
    height: number;
    regions: Region[];
    tiles: Tile[][];
    width: number;
}

interface Region {
    perimeter: number;
    plant: string;
    sides: number;
    tiles: Set<Tile>;
}

interface Tile {
    plant: string;
    region: Region | null;
    x: number;
    y: number;
}


function grid_parse(data: string): Grid {
    const grid: Grid = {
        height: -1,
        regions: [],
        tiles: [],
        width: -1};

    for (const [y, line] of data.split('\n').entries()) {
        const row: Tile[] = [];

        for (const [x, character] of line.split('').entries()) {
            row.push({
                plant: character,
                region: null,
                x: x,
                y: y});
        }

        grid.tiles.push(row);
    }

    grid.height = grid.tiles.length - 1;
    grid.width = grid.tiles[0].length - 1;

    regions_parse(grid);

    grid.regions.map((region) => sides_count(grid, region));

    return grid;
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

function region_walk(grid: Grid, region: Region | null, tile: Tile): void {
    if (tile.region !== null) { return; }

    if (region === null) {
        region = {
            perimeter: 0,
            plant: tile.plant,
            sides: 0,
            tiles: new Set()};

        grid.regions.push(region);
    }

    region.tiles.add(tile);

    tile.region = region;

    const neighbors = Object.values(Direction)
        .map((direction) => neighbor_get(grid, tile, direction))
        .filter((neighbor) => neighbor !== null)
        .filter((neighbor) => neighbor.plant === tile.plant);

    region.perimeter += 4 - neighbors.length;

    neighbors
        .filter((neighbor) => neighbor.region === null)
        .forEach((neighbor) => region_walk(grid, region, neighbor));
}

function regions_parse(grid: Grid): void {
    for (const row of grid.tiles) {
        for (const tile of row) {
            if (tile.region !== null) { continue; }

            region_walk(grid, null, tile);
        }
    }
}

function side_reduce(grid: Grid, region: Region, a: Tile, b: Tile): void {
    Object.values(Direction)
        .forEach((direction) => {
            const neighbors = [a, b]
                .map((tile) => neighbor_get(grid, tile, direction))
                .filter((neighbor) => neighbor?.plant !== region.plant)
            if (neighbors.length === 2) {
                --region.sides;
            }
        });
}

function sides_count(grid: Grid, region: Region): void {
    switch (region.tiles.size) {
        case 0:
            return;
        case 1:
        case 2:
            region.sides = 4;

            return;
        default:
            region.sides = region.perimeter;

            break;
    }

    Array.from(region.tiles)
        .sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x)
        .forEach((tile, index, tiles) => {
            if (index === 0) { return; }

            const a = tiles[index - 1];
            const b = tiles[index];
            if (a.x !== b.x || b.y - a.y !== 1) { return; }

            side_reduce(grid, region, tiles[index - 1], tiles[index]);
        });
    Array.from(region.tiles)
        .sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y)
        .forEach((tile, index, tiles) => {
            if (index === 0) { return; }

            const a = tiles[index - 1];
            const b = tiles[index];
            if (a.y !== b.y || b.x - a.x !== 1) { return; }

            side_reduce(grid, region, tiles[index - 1], tiles[index]);
        });
}


function first(grid: Grid): void {
    let result = 0;

    for (const region of grid.regions) {
        result += region.tiles.size * region.perimeter;
    }

    console.log(`[.] Solution: ${result}`);
}

function second(grid: Grid): void {
    let result = 0;

    for (const region of grid.regions) {
        result += region.tiles.size * region.sides;
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

