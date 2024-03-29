#include "io.h"

#include <stdbool.h>
#include <stdio.h>

#include "array.h"
#include "characters.h"
#include "util.h"

#define SIZE_ARRAY 64
#define SIZE_LINE 16


struct array *
file_into_lines(const char *path, bool ignore_empty) {
    if (!path) { return NULL; }

    FILE *fd = fopen(path, "r");
    if (!fd) { return NULL; }

    struct array *a = array_create(SIZE_ARRAY, ARRAY_PT_T);
    if (!a) { goto exit; }

    struct string *s = NULL;
    while (true) {
        s = string_create(SIZE_LINE);
        if (!s) { goto exit_string; }

        int character;
        while ((character = fgetc(fd)) != EOF) {
            if (character == '\n') { break; }
            if (string_push(s, character) != AOC_E_OK) {
                goto exit_string_push;
            }
        }

        if (ignore_empty && s->empty) {
            s = string_destroy(s);
        }

        union array_data data = { .pt = s};
        if (s && array_push(a, data) != AOC_E_OK) { goto exit_array_push; }
        if (character == EOF) { goto exit; }
    }

exit_array_push:
    s = string_destroy(s);
exit_string_push:
exit_string:
    a = array_destroy(a, string_free);
exit:
    fclose(fd);

    return a;
}

