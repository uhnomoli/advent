function number_parse(data: string): number {
    const number = data.replaceAll(' ', '').split(':')[1];

    return parseInt(number, 10);
}

function numbers_parse(data: string): number[] {
    return [...data.matchAll(/\d+/g)]
        .map(match => parseInt(match[0], 10));
}

function solutions_find(time: number, distance: number): number {
    const shortest = (time - Math.sqrt(time ** 2 - 4 * distance)) / 2;
    const longest = (time + Math.sqrt(time ** 2 - 4 * distance)) / 2;

    return Math.ceil(longest) - Math.ceil(shortest);
}


function first(data: string): void {
    let result = 1;
    const [times, distances] = data.split('\n', 2)
        .map(line => numbers_parse(line));

    for (let i = 0; i < times.length; i++) {
        result *= solutions_find(times[i], distances[i]);
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    const [time, distance] = data.split('\n', 2)
        .map(line => number_parse(line));

    console.log(`[.] Solution: ${solutions_find(time, distance)}`);
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

