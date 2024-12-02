function first(left: number[], right: number[]): void {
    let result = 0;

    left.forEach((value, index) => {
        result += Math.abs(value - right[index]);
    });

    console.log(`[.] Solution: ${result}`);
}

function second(left: number[], right: number[]): void {
    let result = 0;

    const max = right[right.length - 1];
    const min = right[0];

    for (const a of left.values()) {
        if (a < min || a > max) { continue; }

        let count = 0;
        for (const b of right.values()) {
            if (b === a) {
                ++count;
            } else if (b > a) {
                break;
            }
        }

        result += a * count;
    }

    console.log(`[.] Solution: ${result}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then((data) => {
        data = data.trim();

        let left: number[] = [];
        let right: number[] = [];

        for (const line of data.split('\n')) {
            let [a, b]: string[] = line.split('   ');

            left.push(parseInt(a, 10));
            right.push(parseInt(b, 10));
        }

        left.sort();
        right.sort();

        if (part === 1) {
            first(left, right);
        } else {
            second(left, right);
        }
    });
}

