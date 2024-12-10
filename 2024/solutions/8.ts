interface Cell {
    symbol: string;
    x: number;
    y: number;
}

interface Grid {
    antinodes: Set<Cell>;
    cells: Cell[][],
    frequencies: Map<string, Cell[]>;
    height: number;
    width: number;
}


function antinodes_count(grid: Grid, repeat: boolean): void {
    for (const frequency of grid.frequencies.keys()) {
        const cells = grid.frequencies.get(frequency);
        if (cells === undefined) { continue; }

        if (cells.length > 1 && repeat) {
            cells.forEach((cell) => grid.antinodes.add(cell));
        }

        for (const [i, a] of cells.slice(0, cells.length - 1).entries()) {
            for (const b of cells.slice(i + 1)) {
                antinodes_project(grid, a, b, repeat);
            }
        }
    }
}

function antinodes_project(
        grid: Grid, b: Cell, c: Cell, repeat: boolean): void {
    const distance = cell_distance(b, c);

    let bx = b.x;
    let by = b.y;
    let cx = c.x;
    let cy = c.y;

    let vx = c.x - b.x;
    let vy = c.y - b.y;

    do {
        const ax = bx - Math.round(distance * (vx / distance));
        const ay = by - Math.round(distance * (vy / distance));
        if (cell_inbounds(grid, ax, ay)) {
            grid.antinodes.add(grid.cells[ay][ax]);
        } else {
            break;
        }

        vx = bx - ax;
        vy = by - ay;
        bx = ax;
        by = ay;
    } while(repeat);

    vx = c.x - b.x;
    vy = c.y - b.y;

    do {
        const dx = cx + Math.round(distance * (vx / distance));
        const dy = cy + Math.round(distance * (vy / distance));
        if (cell_inbounds(grid, dx, dy)) {
            grid.antinodes.add(grid.cells[dy][dx]);
        } else {
            break;
        }

        vx = dx - cx;
        vy = dy - cy;
        cx = dx;
        cy = dy;
    } while (repeat);
}

function cell_distance(a: Cell, b: Cell): number {
    return Math.sqrt(((b.x - a.x) ** 2) + ((b.y - a.y) ** 2));
}

function cell_inbounds(grid: Grid, x: number, y: number): boolean {
    if (x < 0 || x > grid.width) { return false; }
    if (y < 0 || y > grid.height) { return false; }

    return true;
}

function grid_parse(data: string): Grid {
    const grid: Grid = {
        antinodes: new Set(),
        cells: [],
        frequencies: new Map(),
        height: -1,
        width: -1};

    for (const [y, line] of data.split('\n').entries()) {
        const row: Cell[] = [];

        for (const [x, character] of line.split('').entries()) {
            const cell: Cell = {
                symbol: character,
                x: x,
                y: y};

            if (character !== '.') {
                const frequencies = grid.frequencies.get(character);
                if (frequencies === undefined) {
                    grid.frequencies.set(character, [cell]);
                } else {
                    frequencies.push(cell);
                }
            }

            row.push(cell);
        }

        grid.cells.push(row);
    }

    grid.height = grid.cells.length - 1;
    grid.width = grid.cells[0].length - 1;

    return grid;
}


function first(grid: Grid): void {
    antinodes_count(grid, false);

    console.log(`[.] Solution: ${grid.antinodes.size}`);
}

function second(grid: Grid): void {
    antinodes_count(grid, true);

    console.log(`[.] Solution: ${grid.antinodes.size}`);
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

