function record_possibilities(
        cache: Record<string, number>,
        condition: string,
        groups: number[]): number {
    // source: https://www.youtube.com/watch?v=g3Ms5e7Jdqo :(
    const condition_size = condition.length;
    const groups_size = groups.length;

    if (condition_size === 0) {
        return groups_size === 0 ? 1 : 0;
    }

    if (groups_size === 0) {
        return condition.includes('#') ? 0 : 1;
    }

    const key = `${condition}:${groups.join(',')}`;
    if (key in cache) {
        return cache[key];
    }

    const character = condition[0];
    let possibilities = 0;
    const group = groups[0];

    if ('.?'.includes(character)) {
        possibilities += record_possibilities(
            cache, condition.slice(1), groups);
    }

    if ('#?'.includes(character)) {
        const subject = condition.slice(0, group);
        const suffix = condition[group];

        if (group <= condition_size
                && subject.includes('.') === false
                && (group === condition_size || suffix !== '#')) {
            possibilities += record_possibilities(
                cache, condition.slice(group + 1), groups.slice(1));
        }
    }

    cache[key] = possibilities;

    return possibilities;
}

function* records_parse(data: string, unfold: number):
        Generator<[string, number[]]> {
    for (const record of data.split('\n')) {
        let [condition, groups] = record.split(' ', 2);

        if (unfold > 1) {
            condition = Array(unfold).fill(condition).join('?');
            groups = Array(unfold).fill(groups).join(',');
        }

        yield [
            condition,
            groups.split(',').map(group => parseInt(group, 10))
        ] as const;
    }
}


function first(data: string): void {
    const cache: Record<string, number> = {};
    let result = 0;

    for (const [condition, groups] of records_parse(data, 0)) {
        result += record_possibilities(cache, condition, groups);
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    const cache: Record<string, number> = {};
    let result = 0;

    for (const [condition, groups] of records_parse(data, 5)) {
        result += record_possibilities(cache, condition, groups);
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

