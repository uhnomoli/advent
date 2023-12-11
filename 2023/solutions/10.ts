interface Path {
    tiles: Tile[];
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

interface Map {
    height: number;
    start: Tile;
    tiles: Tile[][];
    width: number;
}

interface Tile {
    symbol: string;
    x: number;
    y: number;
}


function map_parse(data: string): Map {
    let start: Tile = {
        symbol: 'S',
        x: 0,
        y: 0};
    const tiles: Tile[][] = [];

    for (const [y, symbols] of data.split('\n').entries()) {
        const x_start = symbols.indexOf(start.symbol);
        if (x_start !== -1) {
            start.x = x_start;
            start.y = y;
        }

        tiles.push(symbols.split('')
            .map((symbol, x) => ({symbol: symbol, x: x, y: y})));
    }

    const height = tiles.length;
    const width = tiles[0]?.length ?? 0;

    if (height === 0 || width === 0) {
        throw new Error('Invalid map: height and width must be non-zero:');
    }

    return {
        height: height,
        start: start,
        tiles: tiles,
        width: width};
}

function map_walk(map: Map): Path {
    let last: Tile = map.start;
    let location: Tile = map.start;
    const path: Path = {
        tiles: [map.start],
        x1: map.start.x,
        x2: map.start.x,
        y1: map.start.y,
        y2: map.start.y};

    while (true) {
        const possibilities: boolean[] = [
            location.y !== 0,              // north
            location.x !== map.width - 1,  // east
            location.y !== map.height - 1, // south
            location.x !== 0];             // west
        for (const [i, possible] of possibilities.entries()) {
            if (!possible) { continue; }

            let next: Tile = {
                symbol: 'x',
                x: -1,
                y: -1};

            switch (i) {
                case 0: // north
                    next = map.tiles[location.y - 1][location.x];

                    break;
                case 1: // east
                    next = map.tiles[location.y][location.x + 1];

                    break;
                case 2: // south
                    next = map.tiles[location.y + 1][location.x];

                    break;
                case 3: // west
                    next = map.tiles[location.y][location.x - 1];

                    break;
                default:
                    throw new Error('Invalid map movement');
            }

            if (tiles_equal(next, last)) { continue; }
            if (tiles_connected(location.symbol, next.symbol, i)) {
                last = location;
                location = next;

                path.x1 = Math.min(path.x1, location.x);
                path.x2 = Math.max(path.x2, location.x);
                path.y1 = Math.min(path.y1, location.y);
                path.y2 = Math.max(path.y2, location.y);

                break;
            }
        }

        if (tiles_equal(location, map.start)) {
            return path;
        }

        path.tiles.push(location);
    }
}

function point_in(tile: Tile, path: Path): boolean {
    let inside = false;
    const size = path.tiles.length;

    // source: https://stackoverflow.com/a/2922778
    for (let i = 0, j = size - 1; i < size; j = i++) {
        const x_i = path.tiles[i].x;
        const x_j = path.tiles[j].x;
        const x_t = tile.x;
        const y_i = path.tiles[i].y;
        const y_j = path.tiles[j].y;
        const y_t = tile.y;

        if (((y_i > y_t) != (y_j > y_t)) &&
                (x_t < (x_j - x_i) * (y_t - y_i) / (y_j - y_i) + x_i)) {
            inside = !inside;
        }
    }

    return inside;
}

function point_on(x: number, y: number, path: Path): boolean {
    for (const tile of path.tiles) {
        if (x === tile.x && y === tile.y) { return true; }
    }

    return false;
}

function tile_within(tile: Tile, path: Path): boolean {
    if (tile.x < path.x1 || tile.x > path.x2) { return false; }
    if (tile.y < path.y1 || tile.y > path.y2) { return false; }

    return true;
}

function tiles_connected(
        from: string, to: string, direction: number): boolean {
    const e = direction === 1;
    const n = direction === 0;
    const s = direction === 2;
    const w = direction === 3;

    switch (from) {
        case '|':
            if (w || e) { return false; }
            if (n) { return '|7FS'.includes(to); }
            if (s) { return '|LJS'.includes(to); }
        case '-':
            if (n || s) { return false; }
            if (w) { return '-LFS'.includes(to); }
            if (e) { return '-J7S'.includes(to); }
        case 'L':
            if (s || w) { return false; }
            if (n) { return '|7FS'.includes(to); }
            if (e) { return '-J7S'.includes(to); }
        case 'J':
            if (s || e) { return false; }
            if (n) { return '|7FS'.includes(to); }
            if (w) { return '-LFS'.includes(to); }
        case '7':
            if (n || e) { return false; }
            if (s) { return '|LJS'.includes(to); }
            if (w) { return '-LFS'.includes(to); }
        case 'F':
            if (n || w) { return false; }
            if (s) { return '|LJS'.includes(to); }
            if (e) { return '-J7S'.includes(to); }
        case 'S':
            return true;
        default:
            throw new Error('Invalid map movement');
    }
}

function tiles_equal(a: Tile, b: Tile): boolean {
    return a.x === b.x && a.y === b.y;
}


function first(data: string): void {
    const map = map_parse(data);

    console.log(`[.] Solution: ${map_walk(map).tiles.length / 2}`);
}

function second(data: string): void {
    let result = 0;

    const map = map_parse(data);

    const path = map_walk(map);

    for (const [i, row] of map.tiles.entries()) {
        for (const tile of row) {
            if (!tile_within(tile, path)) { continue; }
            if (point_on(tile.x, tile.y, path)) { continue; }
            if (point_in(tile, path)) { result++; }
        }
    }

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

