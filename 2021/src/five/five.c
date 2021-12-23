#include <math.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

#include "array.h"
#include "characters.h"
#include "io.h"
#include "util.h"

#define COORDINATES_SIZE 64


long unsigned int
coordinate_pack(unsigned int x, unsigned int y) {
    if (x >= y) {
        return x * x + x + y;
    }

    return y * y + x;
}

uint64_t
coordinate_unpack(long unsigned int z) {
    uint64_t result = 0;
    double root = floor(sqrt(z));

    double square = root * root;

    if (z - square >= root) {
        result = ((long unsigned int) (z - square - root)) & 0xffffffff;
        result |= ((long unsigned int) root) << 32;
    } else {
        result = ((long unsigned int) root) & 0xffffffff;
        result |= ((long unsigned int) (z - square)) << 32;
    }

    return result;
}

unsigned int
max(unsigned int x, unsigned int y) {
    if (x > y) { return x; }

    return y;
}

unsigned int
min(unsigned int x, unsigned int y) {
    if (x < y) { return x; }

    return y;
}


struct array *
coordinates_parse(struct array *lines) {
    if (!(lines && lines->items && lines->length)) { return NULL; }

    struct array *coordinates = array_create(COORDINATES_SIZE, ARRAY_LU_T);
    if (!coordinates) { return NULL; }

    for (size_t i = 0; i < lines->length; ++i) {
        struct string *line = lines->data.pt[i];

        int end = line->length;
        unsigned int x1 = 0, x2 = 0;
        unsigned int y1 = 0, y2 = 0;

        int count = sscanf(line->value, "%u,%u -> %u,%u%n",
            &x1, &y1, &x2, &y2, &end);

        if (count != 4 || line->value[end]) {
            return array_destroy(coordinates, NULL);
        }

        if (x2 > x1 && y2 > y1) {
            // NE
            while (x1 <= x2 && y1 <= y2) {
                printf("%lu\n", coordinate_pack(x1++, y1++));
            }
        } else if (x2 > x1 && y1 > y2) {
            // SE
            while (x1 <= x2 && y2 <= y1) {
                printf("%lu\n", coordinate_pack(x1++, y1--));
            }
        } else if (x1 > x2 && y1 > y2) {
            // SW
            while (x2 <= x1 && y2 <= y1) {
                printf("%lu\n", coordinate_pack(x1--, y1--));
            }
        } else if (x1 > x2 && y2 > y1) {
            // NW
            while (x2 <= x1 && y1 <= y2) {
                printf("%lu\n", coordinate_pack(x1--, y1++));
            }
        } else if (x1 == x2) {
            for (size_t i = min(y1, y2); i <= max(y1, y2); ++i) {
                printf("%lu\n", coordinate_pack(x1, i));
            }
        } else if (y1 == y2) {
            for (size_t i = min(x1, x2); i <= max(x1, x2); ++i) {
                printf("%lu\n", coordinate_pack(i, y1));
            }
        }
    }

    return coordinates;
}


enum aoc_error
lines_intersections(struct array *lines) {
    if (!(lines && lines->items)) { return AOC_E_ARGUMENT_INVALID; }
    if (!lines->length) { return AOC_E_ARGUMENT_INVALID; }

    struct array *coordinates = coordinates_parse(lines);
    if (!coordinates) { return AOC_E_ALLOC; }


    array_destroy(coordinates, NULL);

    return AOC_E_OK;
}


int
main(int argc, char *argv[]) {
    if (argc != 2) {
        int rc = error_handle(AOC_E_USAGE);

        printf("[?] usage: %s <input_path>\n", argv[0]);

        return rc;
    }

    struct array *lines = file_into_lines(argv[1], true);
    if (!lines) { return error_handle(AOC_E_ERROR); }

    enum aoc_error result = lines_intersections(lines);

    array_destroy(lines, string_free);

    return error_handle(result);
}

