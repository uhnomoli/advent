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


function almanac_parse(data: string): Almanac {
    const [header, ...body] = data.split('\n\n');

    return {
        maps: body.map(map => map_parse(map)),
        seeds: seeds_parse(header)};
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

function seeds_parse(data: string): Seed[] {
    const seeds: Seed[] = [];
    for (const match of data.split(': ')[1].matchAll(/\d+ \d+/g)) {
        const [source, size] = match[0].split(' ')
            .map(number => parseInt(number, 10));

        seeds.push({
            size: size,
            source: source});
    }

    return seeds;
}


function first(data: string): void {
    const almanac = almanac_parse(data);
    let result = 0;

    for (const seed of almanac.seeds) {
        let location = seed.source;
        for (const map of almanac.maps) {
            for (const range of map.ranges) {
                if (location >= range.source
                        && location < range.source + range.size) {
                    location = range.destination + (location - range.source);

                    break;
                }

                if (location < range.source) { break; }
            }
        }

        result = result === 0 ? location : Math.min(result, location);
    }

    console.log(`[.] Solution: ${result}`);
}

function second(data: string): void {
    const almanac = almanac_parse(data);
    let result = -1;

    for (const seed of almanac.seeds) {
        const locations: Seed[] = [seed];
        for (const map of almanac.maps) {
            for (const location of locations) {
                for (const range of map.ranges) {
                    if (location.source >= range.source
                            && location.source < range.source + range.size) {
                        if (location.source + location.size
                                > range.source + range.size) {
                            const source_outside = range.source + range.size;
                            const size_inside = (
                                source_outside - location.source);

                            locations.push({
                                size: location.size - size_inside,
                                source: source_outside});
                            location.size = size_inside;
                        }

                        location.source = range.destination + (
                            location.source - range.source);

                        break;
                    }

                    if (location.source < range.source) {
                        if (location.source + location.size > range.source) {
                            locations.push({
                                size: (location.source + location.size) - (
                                    range.source),
                                source: range.source});
                            location.size = range.source - location.source;
                        }

                        break;
                    }
                }
            }
        }

        result = locations.reduce((accumulator, value, index) => {
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

