#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "array.h"
#include "characters.h"
#include "io.h"
#include "util.h"


enum aoc_error
rate_calculate(struct array *lines) {
    if (!(lines && lines->items)) { return AOC_E_ARGUMENT_INVALID; }
    if (!lines->length) { return AOC_E_ARGUMENT_INVALID; }

    size_t numbers = lines->length;
    size_t number_width = ((struct string *) lines->items[0])->length;
    enum aoc_error result = AOC_E_OK;

    unsigned int *bits = calloc(number_width, sizeof *bits);
    if (!bits) { return AOC_E_ALLOC; }

    for (size_t i = 0; i < lines->length; ++i) {
        struct string *line = lines->items[i];
        if (line->empty) {
            --numbers;

            continue;
        }

        if (line->length != number_width) {
            result = AOC_E_ARGUMENT_INVALID;

            goto exit;
        }

        for (size_t j = 0; j < line->length; ++j) {
            if (line->value[j] == '1') {
                ++bits[j];
            }
        }
    }

    unsigned int rate_epsilon = 0;
    unsigned int rate_gamma = 0;

    for (size_t k = 0; k < number_width; ++k) {
        unsigned int count = bits[k];
        unsigned int value = 1 << (number_width - (k + 1));

        if (count > numbers / 2) {
            rate_gamma += value;
        } else {
            rate_epsilon += value;
        }
    }

    printf("[.] calculation (epsilon, gamma): %u (%u, %u)\n",
        rate_epsilon * rate_gamma, rate_epsilon, rate_gamma);

exit:
    free(bits);

    return result;
}


int
main(int argc, char *argv[]) {
    if (argc != 2) {
        int rc = error_handle(AOC_E_USAGE);

        printf("[?] usage: %s <input_path>\n", argv[0]);

        return rc;
    }

    struct array *lines = file_into_lines(argv[1]);
    if (!lines) { return error_handle(AOC_E_ERROR); }

    enum aoc_error result = rate_calculate(lines);

    array_destroy(lines, string_free);

    return error_handle(result);
}

