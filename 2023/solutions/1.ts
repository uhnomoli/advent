function first(data: string): void {
    let result = 0;
    data.split('\n').forEach(line => {
        let first = 0;
        let last = 0;

        for (let i = 0; i < line.length; ++i) {
            const o = line.charCodeAt(i);
            if (o > 0x2f && o < 0x3a) {
                last = o - 0x30;
                if (first === 0) {
                    first = last * 10;
                }
            }
        }

        result += first + last;
    });

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    const pattern = /(?:[0-9]|one|two|three|four|five|six|seven|eight|nine)/g;
    let result = 0;
    const to_digit: Record<string, number> = {
        '0': 0, 'zero': 0,
        '1': 1, 'one': 1,
        '2': 2, 'two': 2,
        '3': 3, 'three': 3,
        '4': 4, 'four': 4,
        '5': 5, 'five': 5,
        '6': 6, 'six': 6,
        '7': 7, 'seven': 7,
        '8': 8, 'eight': 8,
        '9': 9, 'nine': 9};

    data.split('\n').forEach(line => {
        let first = 0;
        let last = 0;
        let match = null;

        while ((match = pattern.exec(line)) !== null) {
            last = to_digit[match[0]];
            if (first === 0) {
                first = last * 10;
            }

            pattern.lastIndex = match.index + Math.max(match[0].length - 1, 1);
        }

        result += first + last;
    });

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

