interface ConditionRecord {
    condition: string;
    groups: number[];
    springs: number[];
}

interface Possibility {
    index: number;
    size: number;
}


function product(record: ConditionRecord, ...a: any[][]): any[][] {
    return a.reduce((a, b) => {
        return a.flatMap(c => {
            return b.reduce((d, e) => {
                const previous = Array.isArray(c) ? c[c.length - 1] : c;
                if (e.index > previous.index + previous.size) {
                    const f = [c, e].flat();
                    if (f.length !== record.groups.length) {
                        d.push(f);
                    } else if (possibilities_validate(f, record)) {
                        d.push(f);
                    }
                }

                return d;
            }, []);
        });
    });
}

function possibilities_validate(
        possibilities: Possibility[], record: ConditionRecord): boolean {
    return record.springs.every(spring => {
        return possibilities.some(possibility => {
            const end = possibility.index + possibility.size;
            const start = possibility.index;

            return spring >= start && spring < end;
        });
    });
}

function re_generate(groups: number[]): string {
    let re_groups = groups
        .map(group => `[.?]+[#?]{${group}}`)
        .join('');

    return `${re_groups}[.?]*$`;
}

function record_possibilities(
        record: ConditionRecord,
        cache: Record<string, Possibility[]>): number {
    const possibilities: Possibility[][] = [];
    let start = 0;

    for (let i = 0; i < record.groups.length; i++) {
        const condition = record.condition;
        let end = condition.length;
        const possibility: Possibility[] = [];
        const target = record.groups[i];
        const suffix = record.groups.slice(i + 1);

        let re_prefix = '';
        let width = suffix
            .reduce((accumulator, value) => accumulator + value, 0);

        if (i === 0) {
            if (record.springs.length) {
                end = condition.indexOf('#', start);
            }

            re_prefix = '^';
        } else {
            end -= width + suffix.length;
            re_prefix = '(?<=^[.?])';
        }

        let re_possibility = new RegExp(
            `${re_prefix}[#?]{${target}}${re_generate(suffix)}`);

        for (let j = start; j <= end; j++) {
            if (re_possibility.test(condition.slice(j))) {
                possibility.push({
                    index: i === 0 ? j : j + 1,
                    size: target});
            }
        }

        possibilities.push(possibility);
        start = possibility[0]?.index ?? 0;
        start += target;
    }

    return product(record, ...possibilities).length;
}

function records_parse(data: string, unfold: number): ConditionRecord[] {
    const records: ConditionRecord[] = [];

    for (const record of data.split('\n')) {
        let [condition, groups] = record.split(' ', 2);

        if (unfold > 1) {
            condition = Array(unfold).fill(condition).join('?');
            groups = Array(unfold).fill(groups).join(',');
        }

        records.push({
            condition: condition,
            groups: groups.split(',')
                .map(group => parseInt(group, 10)),
            springs: condition.split('')
                .map((character, index) => character === '#' ? index : -1)
                .filter(index => index >= 0)});
    }

    return records;
}


function first(data: string): void {
    const cache: Record<string, Possibility[]> = {};
    let result = 0;

    for (const record of records_parse(data, 0)) {
        result += record_possibilities(record, cache);
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    const cache: Record<string, Possibility[]> = {};
    let result = 0;

    for (const [i, record] of records_parse(data, 5).entries()) {
        result += record_possibilities(record, cache);
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

