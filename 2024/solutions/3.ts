function first(data: string): void {
    const pattern = /mul\((\d{1,3}),(\d{1,3})\)/g;
    let result = 0;

    for (const match of data.matchAll(pattern)) {
        result += parseInt(match[1], 10) * parseInt(match[2], 10);
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    let enabled = true;
    const pattern = /(?:do\(\)|don't\(\)|mul\((\d{1,3}),(\d{1,3})\))/g;
    let result = 0;

    for (const match of data.matchAll(pattern)) {
        const token = match[0];
        if (token === 'do()') {
            enabled = true;
        } else if (token === 'don\'t()') {
            enabled = false;
        } else if (enabled) {
            result += parseInt(match[1], 10) * parseInt(match[2], 10);
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

