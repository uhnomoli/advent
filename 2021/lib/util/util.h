#ifndef UTIL_H
#define UTIL_H

enum aoc_error {
    AOC_E_OK,

    AOC_E_ERROR,
    AOC_E_USAGE,

    AOC_E_ARGUMENT_INVALID,
    AOC_E_ARGUMENT_NULL,

    AOC_E_FATAL,
    AOC_E_ALLOC,
    AOC_E_OVERFLOW,
    AOC_E_UNDERFLOW,
    AOC_E_UNKNOWN
};


int
error_handle(enum aoc_error);

#endif

