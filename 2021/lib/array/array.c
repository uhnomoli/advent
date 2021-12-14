#include "array.h"

#include <stddef.h>
#include <stdlib.h>
#include <string.h>

#include "util.h"


enum aoc_error
array_grow(struct array *a) {
    if (!(a && a->items)) { return AOC_E_ARGUMENT_NULL; }

    size_t capacity = a->capacity * 2;
    if (capacity < a->capacity) { return AOC_E_OVERFLOW; }

    void **items = realloc(a->items, capacity * sizeof *items);
    if (!items) { return AOC_E_ALLOC; }

    memset(items + a->length, '\0', capacity - a->length);

    a->capacity = capacity;
    a->items = items;

    return AOC_E_OK;
}


void
array_clear(struct array *a, void (*function)(void *)) {
    if (!(a && a->items && a->length)) { return; }

    if (!function) {
        function = &free;
    }

    for (size_t i = 0; i < a->length; ++i) {
        if (a->items[i]) {
            function(a->items[i]);

            a->items[i] = NULL;
        }
    }

    a->length = 0;
}

struct array *
array_create(size_t capacity) {
    if (!capacity) { return NULL; }

    struct array *a = calloc(1, sizeof *a);
    if (!a) { return NULL; }

    a->items = calloc(capacity, sizeof *a->items);
    if (!a->items) {
        free(a);

        return NULL;
    }

    a->capacity = capacity;

    return a;
}

struct array *
array_destroy(struct array *a, void (*function)(void *)) {
    if (!a) { return NULL; }

    if (a->items) {
        array_clear(a, function);
        free(a->items);
    }

    free(a);

    return NULL;
}

enum aoc_error
array_insert(struct array *a, size_t index, void *item) {
    if (!(a && a->items && item)) { return AOC_E_ARGUMENT_INVALID; }
    if (index > a->length) { return AOC_E_ARGUMENT_INVALID; }

    if (a->length == a->capacity) {
        if (array_grow(a) != AOC_E_OK) { return AOC_E_ALLOC; }
    }

    for (size_t i = a->length; i > index; --i) {
        a->items[i] = a->items[i - 1];
    }

    a->items[index] = item;
    ++a->length;

    return AOC_E_OK;
}

enum aoc_error
array_map(struct array *a, void (*function)(void *)) {
    if (!(a && a->items && function)) { return AOC_E_ARGUMENT_INVALID; }

    for (size_t i = 0; i < a->length; ++i) {
        (*function)(a->items[i]);
    }

    return AOC_E_OK;
}

void *
array_pop(struct array *a) {
    if (!(a && a->items && a->length)) { return NULL; }

    --a->length;
    void *item = a->items[a->length];
    a->items[a->length] = NULL;

    return item;
}

enum aoc_error
array_push(struct array *a, void *item) {
    if (!(a && a->items && item)) { return AOC_E_ARGUMENT_NULL; }

    if (a->length == a->capacity) {
        if (array_grow(a) != AOC_E_OK) { return AOC_E_ALLOC; }
    }

    a->items[a->length++] = item;

    return AOC_E_OK;
}

