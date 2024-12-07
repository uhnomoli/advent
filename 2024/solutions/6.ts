enum Direction {
    N = 'N',
    E = 'E',
    S = 'S',
    W = 'W'
}

interface Grid {
    height: number;
    tiles: Tile[][];
    width: number;
}

interface Guard {
    deviations: Map<Tile, Set<Direction>>;
    direction: Direction;
    loop: boolean;
    tile: Tile;
}

interface Tile {
    obstacle: boolean;
    x: number;
    y: number;
}


const rotations: Record<Direction, Direction> = {
    [Direction.N]: Direction.E,
    [Direction.E]: Direction.S,
    [Direction.S]: Direction.W,
    [Direction.W]: Direction.N};


function grid_parse(data: string): [Grid, Guard] {
    const grid: Grid = {
        height: -1,
        tiles: [],
        width: -1};
    const guard: Guard = {
        deviations: new Map(),
        direction: Direction.N,
        loop: false,
        tile: {
            obstacle: false,
            x: -1,
            y: -1}};

    for (const [y, line] of data.split('\n').entries()) {
        const row: Tile[] = [];

        for (const [x, character] of line.split('').entries()) {
            const tile: Tile = {
                obstacle: character === '#',
                x: x,
                y: y};

            if (character === '^') {
                guard.tile = tile;
            }

            row.push(tile);
        }

        grid.tiles.push(row);
    }

    grid.height = grid.tiles.length - 1;
    grid.width = grid.tiles[0].length - 1;

    return [grid, guard];
}

function guard_move(grid: Grid, guard: Guard): boolean {
    const tiles = grid.tiles;
    const deviations = guard.deviations;

    let tile = guard.tile;
    switch (guard.direction) {
        case Direction.N:
            if (guard.tile.y === 0) { return false; }

            tile = tiles[guard.tile.y - 1][guard.tile.x];

            break;
        case Direction.E:
            if (guard.tile.x === grid.width) { return false; }

            tile = tiles[guard.tile.y][guard.tile.x + 1];

            break;
        case Direction.S:
            if (guard.tile.y === grid.height) { return false; }

            tile = tiles[guard.tile.y + 1][guard.tile.x];

            break;
        case Direction.W:
            if (guard.tile.x === 0) { return false; }

            tile = tiles[guard.tile.y][guard.tile.x - 1];

            break;
        default:
            throw new Error('Invalid tile coordinate');
    }

    if (!tile.obstacle) {
        guard.tile = tile;

        return true;
    }

    guard.direction = rotations[guard.direction];

    const deviation = deviations.get(tile);
    if (deviation === undefined) {
        deviations.set(tile, new Set([guard.direction]));
    } else if (deviation.has(guard.direction)) {
        guard.loop = true;

        return false;
    } else {
        deviation.add(guard.direction);
    }

    return guard_move(grid, guard);
}

function guard_obstruct(grid: Grid, guard: Guard): number {
    const initial_direction = guard.direction;
    const initial_tile = guard.tile;
    const obstacles: Set<Tile> = new Set();

    while (guard_move(grid, guard)) {
        const canary: Guard = {
            deviations: new Map(),
            direction: initial_direction,
            loop: false,
            tile: initial_tile};

        if (obstacles.has(guard.tile)) { continue; }

        guard.tile.obstacle = true;
        while(guard_move(grid, canary)) {}
        guard.tile.obstacle = false;

        if (canary.loop) {
            obstacles.add(guard.tile);
        }
    }

    return obstacles.size;
}


function first(grid: Grid, guard: Guard): void {
    const visited: Set<Tile> = new Set([guard.tile]);
    while (guard_move(grid, guard)) {
        visited.add(guard.tile);
    }

    console.log(`[.] Solution: ${visited.size}`);
}

function second(grid: Grid, guard: Guard): void {
    let result = guard_obstruct(grid, guard);

    console.log(`[.] Solution: ${result}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then((data) => {
        data = data.trim();

        const [grid, guard] = grid_parse(data);

        if (part === 1) {
            first(grid, guard);
        } else {
            second(grid, guard);
        }
    });
}

