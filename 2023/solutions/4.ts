function numbers_parse(string: string): number[] {
    const numbers: number[] = [];
    for (const match of string.matchAll(/\d+/g)) {
        numbers.push(parseInt(match[0], 10));
    }

    return numbers;
}


function first(data: string): void {
    let result = 0;
    for (const line of data.split('\n')) {
        const [needle, haystack] = line.split(': ')[1].split(' | ', 2)
            .map(numbers => numbers_parse(numbers));

        const winners = haystack.reduce((accumulator, value, index) => {
            return accumulator + (needle.includes(value) ? 1 : 0);
        }, 0);


        result += winners ? 1 << winners - 1 : 0;
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    const lines = data.split('\n');
    let result = 0;

    let cards = lines.length;

    let copies: number[] = Array(cards).fill(1);

    for (let i = 0; i < cards; i++) {
        const [needle, haystack] = lines[i].split(': ')[1].split(' | ', 2)
            .map(numbers => numbers_parse(numbers));

        const winners = haystack.reduce((accumulator, value, index) => {
            return accumulator + (needle.includes(value) ? 1 : 0);
        }, 0);

        for (let j = i + 1; j <= Math.min(i + winners, cards - 1); j++) {
            copies[j] += copies[i];
        }
    }

    result += copies.reduce((accumulator, value, index) => {
        return accumulator + value;
    }, 0);

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

