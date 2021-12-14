#include "characters.h"

#include <ctype.h>
#include <errno.h>
#include <limits.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>

#include "util.h"


enum aoc_error
string_grow(struct string *s) {
    if (!(s && s->value)) { return AOC_E_ARGUMENT_INVALID; }

    size_t capacity = s->capacity * 2;
    if (capacity < s->capacity) { return AOC_E_OVERFLOW; }

    char *value = realloc(s->value, capacity * sizeof *value);
    if (!value) { return AOC_E_ALLOC; }

    memset(value + s->length, '\0', capacity - s->length);

    s->capacity = capacity;
    s->value = value;

    return AOC_E_OK;
}


struct string *
string_create(size_t capacity) {
    if (!capacity) { return NULL; }

    struct string *s = calloc(1, sizeof *s);
    if (!s) { return NULL; }

    s->value = calloc(capacity, sizeof *s->value);
    if (!s->value) {
        free(s);

        return NULL;
    }

    s->capacity = capacity;
    s->empty = true;

    return s;
}

struct string *
string_destroy(struct string *s) {
    string_free(s);

    return NULL;
}

void
string_free(void *p) {
    struct string *s = p;
    if (!s) { return; }

    if (s->value) {
        free(s->value);
    }

    free(s);
}

enum aoc_error
string_push(struct string *s, char c) {
    if (!(s && s->value)) { return AOC_E_ARGUMENT_INVALID; }

    if (s->length == s->capacity) {
        if (string_grow(s) != AOC_E_OK) { return AOC_E_ALLOC; }
    }

    s->value[s->length++] = c;

    if (s->empty && !isspace(c)) {
        s->empty = false;
    }

    return AOC_E_OK;
}


enum aoc_error
string_into_number(char *string, long int *number) {
    if (!(string && strlen(string))) { return AOC_E_ARGUMENT_INVALID; }

    char *endptr = NULL;
    long int result = strtol(string, &endptr, 10);

    if (errno == ERANGE) {
        if (result == LONG_MAX) { return AOC_E_OVERFLOW; }
        if (result == LONG_MIN) { return AOC_E_UNDERFLOW; }
    }

    if (endptr == string || *endptr) {
        return AOC_E_ARGUMENT_INVALID;
    }

    *number = result;

    return AOC_E_OK;
}

