interface History {
    sequences: number[][];
}


function history_next(history: History): number {
    const sequences = history.sequences;
    let value = sequences[sequences.length - 2][0];

    for (let i = sequences.length - 3; i >= 0; i--) {
        const sequence = sequences[i];

        value += sequence[sequence.length - 1];
    }

    return value;
}

function history_parse(data: string): History {
    const history: History = {
        sequences: [sequence_parse(data)]};

    for (const sequence of history.sequences) {
        const values: number[] = [];

        for (let i = 1; i < sequence.length; i++) {
            values.push(sequence[i] - sequence[i - 1]);
        }

        history.sequences.push(values);

        const sum = values
            .reduce((accumulator, value) => accumulator + value);
        if (sum === 0) { break; }
    }

    return history;
}

function history_previous(history: History): number {
    const sequences = history.sequences;
    let value = sequences[sequences.length - 2][0];

    for (let i = sequences.length - 3; i >= 0; i--) {
        const sequence = sequences[i];

        value = sequence[0] - value;
    }

    return value;
}

function sequence_parse(data: string): number[] {
    return data.split(' ')
        .map(number => parseInt(number, 10));
}


function first(data: string): void {
    let result = 0;

    const histories: History[] = data.split('\n')
        .map(line => history_parse(line));
    for (const history of histories) {
        result += history_next(history);
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    let result = 0;

    const histories: History[] = data.split('\n')
        .map(line => history_parse(line));
    for (const history of histories) {
        result += history_previous(history);
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

