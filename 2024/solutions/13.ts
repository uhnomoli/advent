interface Coordinate {
    x: number;
    y: number;
}

interface Machine {
    a: Coordinate;
    b: Coordinate;
    prize: Coordinate;
}


const greater_than = (a: number, b: number): boolean => a >= b;
const lesser_than = (a: number, b: number): boolean => a <= b;


function coordinate_parse(data: string): Coordinate {
    const coordinates = data.match(/(?<=[XY][=+])\d+/g);
    if (coordinates === null || coordinates.length !== 2) {
        throw new Error('Invalid coordinate');
    }

    const [x, y] = coordinates.map((n) => parseInt(n, 10));

    return {x: x, y: y};
}

function machine_parse(data: string): Machine {
    const components = data.split('\n');
    if (components.length !== 3) {
        throw new Error('Invalid machine');
    }

    const [a, b, prize] = components
        .map((component) => coordinate_parse(component));

    return {a: a, b: b, prize: prize};
}

function machine_solve(machine: Machine): number {
    const {a, b, prize} = machine;
    let result = 0;

    const A = (A: number) => a.y * A + b.y * ((prize.x - a.x * A) / b.x);
    const B = (B: number) => a.y * ((prize.x - b.x * B) / a.x) + b.y * B;

    const A_boundary = A(0) - A(1) > 0 ? greater_than : lesser_than;
    for (let i = 0, A_n = A(i); A_boundary(A_n, prize.y); ++i, A_n = A(i)) {
        if (A_n === prize.y) { result += i * 3; }
    }

    const B_boundary = B(0) - B(1) > 0 ? greater_than : lesser_than;
    for (let i = 0, B_n = B(i); B_boundary(B_n, prize.y); ++i, B_n = B(i)) {
        if (B_n === prize.y) { result += i; }
    }

    return result;
}


function first(machines: Machine[]): void {
    let result = 0;

    for (const machine of machines) {
        result += machine_solve(machine);
    }

    console.log(`[.] Solution: ${result}`);
}

function second(machines: Machine[]): void {
    let result = 0;

    console.log(`[.] Solution: ${result}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then((data) => {
        data = data.trim();

        const machines = data
            .split('\n\n')
            .map((chunk) => machine_parse(chunk));

        if (part === 1) {
            first(machines);
        } else {
            second(machines);
        }
    });
}

