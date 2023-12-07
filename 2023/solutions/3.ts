interface Coordinates {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

interface Gear {
    coordinates: Coordinates;
}

interface Part {
    coordinates: Coordinates;
    number: number;
}


function gear_ratio(gear: Gear, parts: Part[][]): number {
    const result: Part[] = [];

    for (let row = gear.coordinates.y1; row <= gear.coordinates.y2; row++) {
        for (const part of parts[row]) {
            const gx1 = gear.coordinates.x1;
            const gx2 = gear.coordinates.x2;
            const px1 = part.coordinates.x1 + 1; // adjust to get occupied
            const px2 = part.coordinates.x2 - 1; // spaces

            if ((px1 >= gx1 && px1 <= gx2)         // gx1--px1==gx2----px2
                    || (px2 >= gx1 && px2 <= gx2)  // px1----gx1==px2--gx2
                    || (px1 < gx1 && px2 > gx2)) { // px1--gx1====gx2--px2
                if (result.length === 2) { return 0; }

                result.push(part);
            }
        }
    }

    if (result.length === 2) {
        return result[0].number * result[1].number;
    }

    return 0;
}

function is_part(rows: string[], coordinates: Coordinates): boolean {
    for (let row = coordinates.y1; row <= coordinates.y2; row++) {
        for (let column = coordinates.x1; column <= coordinates.x2; column++) {
            if (is_symbol(rows[row].charCodeAt(column))) {
                return true;
            }
        }
    }

    return false;
}

function is_number(ordinal: number): boolean {
    if (ordinal > 0x2f && ordinal < 0x3a) {
        return true;
    }

    return false;
}

function is_symbol(ordinal: number): boolean {
    if (ordinal !== 0x2e && (ordinal < 0x30 || ordinal > 0x39)) {
        return true;
    }

    return false;
}


function first(data: string): void {
    const lines = data.split('\n');
    let result = 0;

    const height = lines.length;
    const width = lines[0].length;

    for (let row = 0; row < lines.length; row++) {
        const line = lines[row];
        for (const match of line.matchAll(/\d+/g)) {
            const column = match.index;
            const size = match[0].length;

            // quiet the compiler due to a bug in TypeScript, see:
            // https://github.com/microsoft/TypeScript/issues/36788
            if (typeof column !== 'number') {
                throw new TypeError('match.index is undefined.');
            }

            const coordinates: Coordinates = {
                x1: Math.max(column - 1, 0),
                x2: Math.min(column + size, width - 1),
                y1: Math.max(row - 1, 0),
                y2: Math.min(row + 1, height - 1)};

            if (is_part(lines, coordinates)) {
                result += parseInt(match[0], 10);
            }
        }
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    const lines = data.split('\n');
    const gears: Gear[] = [];
    const parts: Part[][] = [];
    let result = 0;

    const height = lines.length;
    const width = lines[0].length;

    for (let row = 0; row < lines.length; row++) {
        parts.push([]);

        const line = lines[row];
        for (const match of line.matchAll(/(?:\*|\d+)/g)) {
            const column = match.index;
            const size = match[0].length;

            // quiet the compiler due to a bug in TypeScript, see:
            // https://github.com/microsoft/TypeScript/issues/36788
            if (typeof column !== 'number') {
                throw new TypeError('match.index is undefined.');
            }

            const coordinates: Coordinates = {
                x1: Math.max(column - 1, 0),
                x2: Math.min(column + size, width - 1),
                y1: Math.max(row - 1, 0),
                y2: Math.min(row + 1, height - 1)};

            if (match[0] === '*') {
                gears.push({
                    coordinates: coordinates});
            } else {
                parts[row].push({
                    coordinates: coordinates,
                    number: parseInt(match[0], 10)});
            }
        }
    }

    for (const gear of gears) {
        result += gear_ratio(gear, parts);
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

