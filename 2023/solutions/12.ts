interface Possibility {
    index: number;
    size: number;
}

interface Record {
    condition: string;
    groups: number[];
    springs: number[];
}


function product(...a: any[][]): any[][] {
    return a.reduce((a, b) => {
        return a.flatMap(c => {
            return b.map(d => [c, d].flat());
        });
    });
}

function possibilities_validate(
        possibilities: Possibility[], record: Record): boolean {
    const springs: Set<number> = new Set();

    for (let i = 0; i < possibilities.length; ++i) {
        const b = possibilities[i];

        for (const spring of record.springs) {
            if (spring >= b.index && spring < b.index + b.size) {
                springs.add(spring);
            }
        }

        if (i === 0) { continue; }

        const a = possibilities[i - 1];

        if (a.index + a.size >= b.index) { return false; }
    }

    return springs.size === record.springs.length;
}

function re_generate(groups: number[]): string {
    let re_groups = groups
        .map(group => `[.?]+[#?]{${group}}`)
        .join('');

    return `${re_groups}[.?]*$`;
}

function record_possibilities(record: Record): number {
    const possibilities: Possibility[][] = [];
    let start = 0;

    //console.log('condition =>', record.condition);
    //console.log('groups =>', record.groups);
    //console.log('springs =>', record.springs);
    //console.log('\n-------------------------\n');

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

        //console.log('re =>', re_possibility.toString());
        //console.log('range =>', start, end);

        for (let j = start; j <= end; j++) {
            if (re_possibility.test(condition.slice(j))) {
                possibility.push({
                    index: i === 0 ? j : j + 1,
                    size: target});

                //console.log('  match =>', i === 0 ? j : j + 1, target);
            }
        }

        possibilities.push(possibility);
        start = possibility[0]?.index ?? 0;
        start += target;

        //console.log('\n-------------------------\n');
    }

    const wat = product(...possibilities)
        .filter(possibility => possibilities_validate(possibility, record));

    console.log('total =>', wat.length);
    //console.log('\n=========================\n');

    return wat.length;
}

function records_parse(data: string, unfold: boolean): Record[] {
    const records: Record[] = [];

    for (const record of data.split('\n')) {
        let [condition, groups] = record.split(' ', 2);

        if (unfold) {
            condition = Array(2).fill(condition).join('?');
            groups = Array(2).fill(groups).join(',');
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
    let result = 0;

    for (const record of records_parse(data, false)) {
        result += record_possibilities(record);
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    let result = 0;

    for (const record of records_parse(data, true)) {
        result += record_possibilities(record);
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

