function game_validate(input: string): boolean {
    for (const match of input.matchAll(/(\d+) (blue|green|red)/g)) {
        const n = parseInt(match[1], 10);
        const color = match[2];

        if (color === 'blue' && n > 14) { return false; }
        if (color === 'green' && n > 13) { return false; }
        if (color === 'red' && n > 12) { return false; }
    }

    return true;
}


function first(data: string): void {
    let result = 0;
    for (const line of data.split('\n')) {
        const [game, input] = line.split(': ', 2);

        if (game_validate(input)) {
            result += parseInt(game.split(' ')[1], 10);
        }
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    let result = 0;
    for (const line of data.split('\n')) {
        const [game, input] = line.split(': ', 2);
        const dice: Record<string, number> = {
            'blue': 0,
            'green': 0,
            'red': 0};

        for (const pull of input.split('; ')) {
            for (const match of pull.matchAll(/(\d+) (blue|green|red)/g)) {
                const n = parseInt(match[1], 10);
                const color = match[2];

                dice[color] = Math.max(dice[color], n);
            }
        }

        result += dice['blue'] * dice['green'] * dice['red'];
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

