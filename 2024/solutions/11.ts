interface Stone {
    count: number;
    digits: number;
    value: number;
}


function blink_simulate(stone: Stone, value: number, times: number): void {
    if (times === 0) { return; }

    const digits = digits_count(value);

    if (value === 0) {
        blink_simulate(stone, 1, times - 1);
    } else if (digits % 2 === 0) {
        ++stone.count;

        const [left, right] = digits_split(value, digits);

        blink_simulate(stone, left, times - 1);
        blink_simulate(stone, right, times - 1);
    } else {
        blink_simulate(stone, value * 2024, times - 1);
    }
}

function digits_count(a: number): number {
    return Math.floor(Math.log10(a)) + 1;
}

function digits_split(a: number, digits: number): [number, number] {
    const base = Math.pow(10, digits / 2);

    return [Math.floor(a / base), a % base];
}


function first(stones: Stone[]): void {
    let result = 0;

    stones.forEach((stone) => {
        blink_simulate(stone, stone.value, 25);

        result += stone.count;
    });

    console.log(`[.] Solution: ${result}`);
}

function second(stones: Stone[]): void {
    let result = 0;

    console.log(`[.] Solution: ${result}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then((data) => {
        data = data.trim();

        const stones: Stone[] = [];
        for (const chunk of data.split(' ')) {
            stones.push({
                count: 1,
                digits: chunk.length,
                value: parseInt(chunk, 10)});
        }

        if (part === 1) {
            first(stones);
        } else {
            second(stones);
        }
    });
}

