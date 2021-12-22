#include <stdbool.h>
#include <stdio.h>
#include <string.h>

#include "array.h"
#include "characters.h"
#include "io.h"
#include "util.h"


enum two_commands {
    COMMAND_DOWN = 5,
    COMMAND_FORWARD = 8,
    COMMAND_UP = 3
};


enum aoc_error
position_calculate(struct array *lines, bool aiming) {
    if (!(lines && lines->items)) { return AOC_E_ARGUMENT_INVALID; }
    if (!lines->length) { return AOC_E_ARGUMENT_INVALID; }

    long int aim = 0;
    long int depth = 0;
    long int position = 0;

    for (size_t i = 0; i < lines->length; ++i) {
        long int *axis = NULL;
        long int direction = 0;
        long int distance = 0;
        struct string *line = lines->data.pt[i];
        size_t offset = 0;

        if (!strncmp(line->value, "down ", COMMAND_DOWN)) {
            axis = &depth;
            direction = 1;
            offset = COMMAND_DOWN;
        } else if (!strncmp(line->value, "forward ", COMMAND_FORWARD)) {
            axis = &position;
            direction = 1;
            offset = COMMAND_FORWARD;
        } else if (!strncmp(line->value, "up ", COMMAND_UP)) {
            axis = &depth;
            direction = -1;
            offset = COMMAND_UP;
        } else {
            return AOC_E_ARGUMENT_INVALID;
        }

        enum aoc_error result = string_into_number(
            line->value + offset, &distance, 10);
        if (result != AOC_E_OK) { return result; }

        if (aiming) {
            if (offset == COMMAND_FORWARD) {
                depth += aim * distance;
            } else {
                axis = &aim;
            }
        }

        *axis += distance * direction;
    }

    printf("[.] calculation (position, depth, aim): %ld (%ld, %ld, %ld)\n",
        position * depth, position, depth, aim);

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

    enum aoc_error result = AOC_E_OK;
    result = position_calculate(lines, false);
    if (result != AOC_E_OK) { goto exit; }

    result = position_calculate(lines, true);

exit:
    array_destroy(lines, string_free);

    return error_handle(result);
}

