interface File {
    id: number;
    moved: boolean;
    padding: number;
    size: number;
}


function file_checksum(index: number, file: File): number {
    if (file.id === 0) { return 0; }

    return file.id * (file.size * index + ((file.size - 1) * file.size) / 2);
}

function filesystem_compact(files: File[]): number {
    files = JSON.parse(JSON.stringify(files));

    let checksum = 0;
    let destination = files[0];
    let index = 0;
    let source = files[files.length - 1];

    while (destination.id <= source.id) {
        for (;destination.size > 0; --destination.size) {
            checksum += destination.id * index++;
        }

        for (;destination.padding > 0; --destination.padding) {
            if (source.size === 0) {
                source = files[source.id - 1];
                if (source.size === 0) { break; }
            }

            checksum += source.id * index++;
            --source.size;
        }

        destination = files[destination.id + 1];
    }

    return checksum;
}

function filesystem_defragment(files: File[]): number {
    files = JSON.parse(JSON.stringify(files));

    let source_index = files.length;
    while (--source_index > 0) {
        const source = files[source_index];
        if (source.moved) { continue; }

        const destination_index = files.findIndex((file, index) => {
            return source.size <= file.padding && index < source_index;
        });

        if (destination_index === -1) { continue; }

        const destination = files[destination_index];
        const destination_index_right = destination_index + 1;
        const source_left = files[source_index - 1];

        source_left.padding += source.size + source.padding;
        source.padding = destination.padding - source.size;
        destination.padding = 0;

        files.splice(source_index, 1);
        files.splice(destination_index_right, 0, source);

        source.moved = true;

        ++source_index;
    }

    return files
        .reduce((accumulator, file) => {
                accumulator.checksum += file_checksum(accumulator.index, file);
                accumulator.index += file.size + file.padding;

                return accumulator;
            }, {checksum: 0, index: 0})
        .checksum;
}


function first(files: File[]): void {
    const checksum = filesystem_compact(files);

    console.log(`[.] Solution: ${checksum}`);
}

function second(files: File[]): void {
    const checksum = filesystem_defragment(files);

    console.log(`[.] Solution: ${checksum}`);
}


export function run(part: number, input: string): void {
    Bun.file(input).text().then((data) => {
        data = data.trim();
        if (data.length % 2 !== 0) {
            data += '0';
        }

        const files: File[] = [];

        for (const [index, chunk] of data.match(/\d\d/g)?.entries() || []) {
            const [size, padding] = chunk.split('')
                .map((character) => parseInt(character, 10));

            files.push({
                id: index,
                moved: false,
                padding: padding,
                size: size});
        }

        if (part === 1) {
            first(files);
        } else {
            second(files);
        }
    });
}

