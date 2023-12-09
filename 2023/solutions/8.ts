interface Map {
    instructions: string[];
    nodes: Record<string, Node>;
}

interface Node {
    left: string;
    right: string;
}


function gcd(a: number, b: number): number {
    return a ? gcd(b % a, a) : b;
}

function lcm(a: number, b: number): number {
    return a * b / gcd(a, b);
}

function map_parse(data: string): Map {
    const [instructions, nodes] = data.split('\n\n', 2);

    return {
        instructions: instructions.split('')
            .map(instruction => instruction === 'L' ? 'left' : 'right'),
        nodes: nodes_parse(nodes)};
}

function node_traverse(start: string, end: RegExp, map: Map): number {
    let location = start;
    let steps = 0;

    while (true) {
        for (const instruction of map.instructions) {
            location = map.nodes[location][instruction as keyof Node];
            steps++;

            if (end.test(location)) { return steps; }
        }
    }
}

function nodes_parse(data: string): Record<string, Node> {
    const nodes: Record<string, Node> = {};
    const re_node = /([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/;

    for (const line of data.split('\n')) {
        const match = line.match(re_node);
        if (match !== null) {
            nodes[match[1]] = {
                left: match[2],
                right: match[3]};
        }
    }

    return nodes;
}

function nodes_traverse(start: RegExp, end: RegExp, map: Map): number {
    const locations = Object.keys(map.nodes)
        .filter(node => start.test(node));
    let steps: number[] = [];

    for (const [i, location] of locations.entries()) {
        steps.push(node_traverse(location, end, map));
    }

    return steps.reduce(lcm);
}


function first(data: string): void {
    const map = map_parse(data);

    console.log(`[.] Solution: ${node_traverse('AAA', /ZZZ/, map)}`);
}

function second(data: string): void {
    const map = map_parse(data);

    console.log(`[.] Solution: ${nodes_traverse(/A$/, /Z$/, map)}`);
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

