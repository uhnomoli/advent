import * as fs from 'node:fs';

import { Command, InvalidArgumentError } from 'commander';


function option_day(value: string, previous: string): string {
    const day = parseInt(value, 10);
    if (isNaN(day) || day < 1 || day > 25) {
        throw new InvalidArgumentError('Invalid day, must be 1-25.');
    }

    const result = import.meta.resolveSync(
        `${import.meta.dir}/solutions/${day.toString()}.ts`);
    try {
        option_path(result, '');
    } catch (error: unknown) {
        throw new InvalidArgumentError('No solution for that day.');
    }

    return result;
}

function option_part(value: string, previous: number): number {
    const result = parseInt(value, 10);
    if (isNaN(result) || result < 1 || result > 2) {
        throw new InvalidArgumentError('Invalid part, must 1-2.');
    }

    return result;
}

function option_path(value: string, previous: string): string {
    try {
        fs.accessSync(value, fs.constants.R_OK);
    } catch (error: unknown) {
        throw new InvalidArgumentError('File not found.');
    }

    return value;
}


const program = new Command();
program
    .name('advent-of-code-2023')
    .description('Solutions to challenges from Advent of Code 2023')
    .option('-p, --part <number>', 'part to solve', option_part, 1)
    .requiredOption('-d, --day <number>', 'day to solve', option_day)
    .requiredOption(
        '-i, --input <path>', 'path to challenge input', option_path)
    .version('0.1.0');

const options = program
    .parse()
    .opts();

import(options.day).then(solution => {
    solution.run(options.part, options.input);
});

