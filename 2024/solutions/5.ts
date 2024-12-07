function update_fix(rules: number[][], update: number[]): number {
    update.sort(update_sort(rules));

    return update[Math.floor(update.length / 2)];
}

function update_sort(rules: number[][]): (a: number, b: number) => number {
    return function (a: number, b: number): number {
        const rule = rules.filter((rule) => {
            return rule.includes(a) && rule.includes(b);
        });

        if (rule.length === 0) { return 0; }

        const [first, second] = rule[0];

        if (a === first) { return -1; }
        if (b === first) { return 1; }

        return 0;
    };
}

function update_validate(rules: number[][], update: number[]): number {
    for (const [index, [first, second]] of rules.entries()) {
        if (!rules[index].every((page) => update.includes(page))) { continue; }
        if (update.indexOf(first) > update.indexOf(second)) { return 0; }
    }

    return update[Math.floor(update.length / 2)];
}


function first(rules: number[][], updates: number[][]): void {
    let result = 0;

    for (const update of updates) {
        result += update_validate(rules, update);
    }

    console.log(`[.] Solution: ${result}`);
}

function second(rules: number[][], updates: number[][]): void {
    let result = 0;

    for (const update of updates) {
        if (update_validate(rules, update) !== 0) { continue; }

        result += update_fix(rules, update);
    }

    console.log(`[.] Solution: ${result}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then((data) => {
        data = data.trim();

        const sections = data.split('\n\n');

        const rules: number[][] = [];
        for (const line of sections[0].split('\n')) {
            rules.push(line.split('|').map((page) => parseInt(page, 10)));
        }

        const updates: number[][] = [];
        for (const line of (sections[1].split('\n'))) {
            updates.push(line.split(',').map((page) => parseInt(page, 10)));
        }

        if (part === 1) {
            first(rules, updates);
        } else {
            second(rules, updates);
        }
    });
}

