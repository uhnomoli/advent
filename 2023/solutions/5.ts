interface Almanac {
    maps: Map[];
    seeds: Seed[];
}

interface Map {
    destination: string;
    ranges: MapRange[];
    source: string;
}

interface MapRange {
    destination: number;
    size: number;
    source: number;
}

interface Seed {
    size: number;
    source: number;
}


function almanac_parse(data: string, mode: string): Almanac {
    const [header, ...body] = data.split('\n\n');

    return {
        maps: body.map(map => map_parse(map)),
        seeds: seeds_parse(header, mode)};
}

function map_parse(data: string): Map {
    const [header, ...body] = data.split('\n');

    const [source, destination] = header.split(' ')[0].split('-to-');
    const ranges = body.map(range => range_parse(range));

    ranges.sort((a, b) => a.source - b.source);

    return {
        destination: destination,
        ranges: ranges,
        source: source};
}

function range_parse(data: string): MapRange {
    const [destination, source, size] =  data.split(' ')
        .map(number => parseInt(number, 10));

    return {
        destination: destination,
        size: size,
        source: source};
}

function seeds_parse(data: string, mode: string): Seed[] {
    const numbers = data.split(': ')[1];
    const seeds: Seed[] = [];

    switch (mode) {
        case 'range':
            for (const match of numbers.matchAll(/\d+ \d+/g)) {
                const [source, size] = match[0].split(' ')
                    .map(number => parseInt(number, 10));

                seeds.push({
                    size: size,
                    source: source});
            }

            break;
        case 'single':
            seeds.push(...numbers.split(' ')
                .map(number => ({size: 1, source: parseInt(number, 10)})));

            break;
        default:
            throw new Error(
                `Invalid seed parse mode: ${mode}: must be: range, seed`);
    }

    return seeds;
}

function seed_to_location(seed: Seed, maps: Map[]): Seed[] {
    const locations: Seed[] = [seed];
    for (const map of maps) {
        for (const location of locations) {
            for (const range of map.ranges) {
                if (location.source >= range.source
                        && location.source < range.source + range.size) {
                    const location_end = location.source + location.size;
                    const range_end = range.source + range.size;

                    if (location_end > range_end) {
                        const size_contained = range_end - location.source;

                        locations.push({
                            size: location.size - size_contained,
                            source: range_end});
                        location.size = size_contained;
                    }

                    location.source = range.destination + (
                        location.source - range.source);

                    break;
                }

                if (location.source < range.source) {
                    const location_end = location.source + location.size;
                    if (location_end > range.source) {
                        locations.push({
                            size: location_end - range.source,
                            source: range.source});
                        location.size = range.source - location.source;
                    }

                    break;
                }
            }
        }
    }

    return locations;
}


function first(data: string): void {
    const almanac = almanac_parse(data, 'single');
    let result = -1;

    for (const seed of almanac.seeds) {
        result = seed_to_location(seed, almanac.maps)
            .reduce((accumulator, value) => {
                return accumulator === -1 ?
                    value.source : Math.min(accumulator, value.source);
            }, result);
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    const almanac = almanac_parse(data, 'range');
    let result = -1;

    for (const seed of almanac.seeds) {
        result = seed_to_location(seed, almanac.maps)
            .reduce((accumulator, value) => {
                return accumulator === -1 ?
                    value.source : Math.min(accumulator, value.source);
            }, result);
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

