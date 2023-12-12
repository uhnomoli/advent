interface Coordinate {
    x: number;
    y: number;
}

interface Image {
    galaxies: Coordinate[];
    x_max: number;
    y_max: number;
}


function galaxy_distance(a: Coordinate, b: Coordinate): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function galaxy_walk(image: Image): number {
    let distances = 0;
    const galaxies = image.galaxies;
    const size = image.galaxies.length;

    for (let i = 0; i < size - 1; i++) {
        for (let j = i + 1; j < size; j++) {
            distances += galaxy_distance(galaxies[i], galaxies[j]);
        }
    }

    return distances;
}

function image_parse(data: string, factor: number): Image {
    const image: Image = {
        galaxies: [],
        y_max: 0,
        x_max: 0};
    let x_occupied: Set<number> = new Set();
    let y_occupied: Set<number> = new Set();

    for (const [y, row] of data.split('\n').entries()) {
        if (!row.includes('#')) { continue; }

        y_occupied.add(y);

        for (const match of row.matchAll(/#/g)) {
            const x = match.index;

            // quiet the compiler due to a bug in TypeScript, see:
            // https://github.com/microsoft/TypeScript/issues/36788
            if (typeof x !== 'number') {
                throw new TypeError('match.index is undefined');
            }

            image.galaxies.push({x: x, y: y});
            image.x_max = Math.max(image.x_max, x);
            image.y_max = Math.max(image.y_max, y);
            x_occupied.add(x);
        }
    }

    if (image.x_max === 0 || image.y_max === 0) {
        throw new Error('Invalid image: y_max and x_max must be non-zero:');
    }

    factor = Math.max(factor - 1, 1);

    let x_adjusted = 0;
    for (let x = 0; x <= image.x_max; x++) {
        if (x_occupied.has(x)) { continue; }

        for (const galaxy of image.galaxies) {
            if (galaxy.x - x_adjusted * factor > x) {
                galaxy.x += factor;
            }
        }

        x_adjusted++;
    }

    let y_adjusted = 0;
    for (let y = 0; y <= image.y_max; y++) {
        if (y_occupied.has(y)) { continue; }

        for (const galaxy of image.galaxies) {
            if (galaxy.y - y_adjusted * factor > y) {
                galaxy.y += factor;
            }
        }

        y_adjusted++;
    }

    return image;
}


function first(data: string): void {
    const image = image_parse(data, 1);

    console.log(`[.] Solution: ${galaxy_walk(image)}`);
}

function second(data: string): void {
    const image = image_parse(data, 1000000);

    console.log(`[.] Solution: ${galaxy_walk(image)}`);
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

