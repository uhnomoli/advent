function blink_simulate(
        cache: Map<string, number>,
        value: number,
        iterations: number): number {
    const key = `${value}:${iterations}`;

    let result = cache.get(key) || 0;
    if (result !== 0) { return result; }

    const digits = digits_count(value);

    if (iterations === 0) {
        result = 1;
    } else if (value === 0) {
        result += blink_simulate(cache, 1, iterations - 1);
    } else if (digits % 2 === 0) {
        const [left, right] = digits_split(value, digits);

        result += blink_simulate(cache, left, iterations - 1);
        result += blink_simulate(cache, right, iterations - 1);
    } else {
        result += blink_simulate(cache, value * 2024, iterations - 1);
    }

    cache.set(key, result);

    return result;
}

function digits_count(a: number): number {
    return Math.floor(Math.log10(a)) + 1;
}

function digits_split(a: number, digits: number): [number, number] {
    const base = Math.pow(10, digits / 2);

    return [Math.floor(a / base), a % base];
}


function first(stones: number[]): void {
    let result = 0;

    const cache = new Map();
    stones.forEach((stone) => result += blink_simulate(cache, stone, 25));

    console.log(`[.] Solution: ${result}`);
}

function second(stones: number[]): void {
    let result = 0;

    const cache = new Map();
    stones.forEach((stone) => result += blink_simulate(cache, stone, 75));

    console.log(`[.] Solution: ${result}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then((data) => {
        data = data.trim();

        const stones: number[] = data.split(' ')
            .map((chunk) => parseInt(chunk, 10));

        if (part === 1) {
            first(stones);
        } else {
            second(stones);
        }
    });
}

