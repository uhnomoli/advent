#include <limits.h>
#include <stdio.h>

#include "array.h"
#include "characters.h"
#include "io.h"
#include "util.h"


enum aoc_error
increment_count(struct array *lines, size_t window) {
    if (!(lines && lines->items)) { return AOC_E_ARGUMENT_INVALID; }
    if (!lines->length) { return AOC_E_ARGUMENT_INVALID; }
    if (window >= lines->length) { return AOC_E_ARGUMENT_INVALID; }

    unsigned int count = 0;
    for (size_t i = window; i < lines->length; ++i) {
        struct string *line = NULL;
        enum aoc_error result = AOC_E_OK;
        long int x, y = 0;

        line = lines->items[i];
        if (line->empty) { continue; }
        result = string_into_number(line->value, &y);
        if (result != AOC_E_OK) { return result; }

        line = lines->items[i - window];
        if (line->empty) { continue; }
        result = string_into_number(line->value, &x);
        if (result != AOC_E_OK) { return result; }

        if (y > x) { ++count; }
    }

    printf("[.] increment count (window %zd): %u\n", window, count);

    return AOC_E_OK;
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

    enum aoc_error result = AOC_E_OK;
    result = increment_count(lines, 1);
    if (result != AOC_E_OK) { goto exit; }

    result = increment_count(lines, 3);

exit:
    array_destroy(lines, string_free);

    return error_handle(result);
}

