#include "util.h"

#include <stdio.h>
#include <sysexits.h>


int
error_handle(enum aoc_error error) {
    if (error >= AOC_E_FATAL) {
        fprintf(stderr, "[x] FATAL: ");
    } else if (error > AOC_E_OK) {
        fprintf(stderr, "[!] ERROR: ");
    }

    switch (error) {
        case AOC_E_ALLOC:
            fputs("Failed allocating memory\n", stderr);

            return EX_OSERR;
        case AOC_E_ARGUMENT_INVALID:
        case AOC_E_ARGUMENT_NULL:
            return EX_DATAERR;
        case AOC_E_OK:
            return EX_OK;
        case AOC_E_OVERFLOW:
        case AOC_E_UNDERFLOW:
            return EX_SOFTWARE;
        case AOC_E_USAGE:
            fputs("Invalid usage\n", stderr);

            return EX_USAGE;
        case AOC_E_ERROR:
        case AOC_E_FATAL:
        case AOC_E_UNKNOWN:
        default:
            fputs("Unknown error occurred\n", stderr);

            return EX_UNAVAILABLE;
    }
}

