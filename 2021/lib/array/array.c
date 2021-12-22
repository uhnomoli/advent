#include "array.h"

#include <stddef.h>
#include <stdlib.h>
#include <string.h>

#include "util.h"


enum aoc_error
array_grow(struct array *a) {
    if (!(a && a->items)) { return AOC_E_ARGUMENT_INVALID; }

    size_t capacity = a->capacity * 2;
    if (capacity < a->capacity) { return AOC_E_OVERFLOW; }

    void *items = NULL;

    switch (a->type) {
        case ARRAY_LD_T:
            items = realloc(a->data.ld, capacity * sizeof *a->data.ld);
            if (!items) { return AOC_E_ALLOC; }

            memset(
                (long int *) items + a->length,
                '\0',
                capacity - a->length);

            a->data.ld = items;
            a->items = items;

            break;
        case ARRAY_LU_T:
            items = realloc(a->data.lu, capacity * sizeof *a->data.lu);
            if (!items) { return AOC_E_ALLOC; }

            memset(
                (unsigned long int *) items + a->length,
                '\0',
                capacity - a->length);

            a->data.lu = items;
            a->items = items;

            break;
        case ARRAY_PT_T:
            items = realloc(a->data.pt, capacity * sizeof *a->data.pt);
            if (!items) { return AOC_E_ALLOC; }

            memset(
                (void **) items + a->length,
                '\0',
                capacity - a->length);

            a->data.pt = items;
            a->items = items;

            break;
    }

    a->capacity = capacity;

    return AOC_E_OK;
}


void
array_clear(struct array *a, void (*function)(void *)) {
    if (!(a && a->items && a->length)) { return; }
    if (a->type != ARRAY_PT_T) { return; }

    if (!function) {
        function = &free;
    }

    for (size_t i = 0; i < a->length; ++i) {
        if (a->data.pt[i]) {
            function(a->data.pt[i]);

            a->data.pt[i] = NULL;
        }
    }

    a->length = 0;
}

struct array *
array_copy(struct array *a) {
    if (!(a && a->items && a->length)) { return NULL; }

    struct array *b = array_create(a->capacity, a->type);
    if (!b) { return NULL; }

    switch (a->type) {
        case ARRAY_LD_T:
            for (size_t i = 0; i < a->length; ++i) {
                union array_data data = { .ld = a->data.ld[i] };
                if (array_push(b, data) != AOC_E_OK) {
                    b = array_destroy(b, NULL);

                    break;
                }
            }

            break;
        case ARRAY_LU_T:
            for (size_t i = 0; i < a->length; ++i) {
                union array_data data = { .lu = a->data.lu[i] };
                if (array_push(b, data) != AOC_E_OK) {
                    b = array_destroy(b, NULL);

                    break;
                }
            }

            break;
        case ARRAY_PT_T:
            for (size_t i = 0; i < a->length; ++i) {
                union array_data data = { .pt = a->data.pt[i] };
                if (array_push(b, data) != AOC_E_OK) {
                    b = array_destroy(b, NULL);

                    break;
                }
            }

            break;
    }

    return b;
}

struct array *
array_create(size_t capacity, enum array_type type) {
    if (!capacity) { return NULL; }

    struct array *a = calloc(1, sizeof *a);
    if (!a) { return NULL; }

    switch (type) {
        case ARRAY_LD_T:
            a->items = a->data.ld = calloc(capacity, sizeof *a->data.ld);

            break;
        case ARRAY_LU_T:
            a->items = a->data.lu = calloc(capacity, sizeof *a->data.lu);

            break;
        case ARRAY_PT_T:
            a->items = a->data.pt = calloc(capacity, sizeof *a->data.pt);

            break;
    }

    if (!a->items) {
        free(a);

        return NULL;
    }

    a->capacity = capacity;
    a->type = type;

    return a;
}

enum aoc_error
array_delete(struct array *a, size_t index) {
    if (!(a && a->items && a->length)) { return AOC_E_ARGUMENT_INVALID; }
    if (index >= a->length) { return AOC_E_ARGUMENT_INVALID; }

    switch (a->type) {
        case ARRAY_LD_T:
            for (size_t i = index; i < a->length - 1; ++i) {
                a->data.ld[i] = a->data.ld[i + 1];
            }

            a->data.ld[--a->length] = 0;

            break;
        case ARRAY_LU_T:
            for (size_t i = index; i < a->length - 1; ++i) {
                a->data.lu[i] = a->data.lu[i + 1];
            }

            a->data.lu[--a->length] = 0;

            break;
        case ARRAY_PT_T:
            for (size_t i = index; i < a->length - 1; ++i) {
                a->data.pt[i] = a->data.pt[i + 1];
            }

            a->data.pt[--a->length] = NULL;

            break;
    }

    return AOC_E_OK;
}

struct array *
array_destroy(struct array *a, void (*function)(void *)) {
    if (!a) { return NULL; }

    if (a->items) {
        if (a->type == ARRAY_PT_T && function) {
            array_clear(a, function);
        }

        free(a->items);
    }

    free(a);

    return NULL;
}

enum aoc_error
array_insert(struct array *a, size_t index, union array_data data) {
    if (!(a && a->items)) { return AOC_E_ARGUMENT_INVALID; }
    if (index > a->length) { return AOC_E_ARGUMENT_INVALID; }
    if (a->type == ARRAY_PT_T && !data.pt) { return AOC_E_ARGUMENT_INVALID; }

    if (a->length == a->capacity) {
        if (array_grow(a) != AOC_E_OK) { return AOC_E_ALLOC; }
    }

    switch (a->type) {
        case ARRAY_LD_T:
            for (size_t i = a->length; i > index; --i) {
                a->data.ld[i] = a->data.ld[i - 1];
            }

            a->data.ld[index] = data.ld;

            break;
        case ARRAY_LU_T:
            for (size_t i = a->length; i > index; --i) {
                a->data.lu[i] = a->data.lu[i - 1];
            }

            a->data.lu[index] = data.lu;

            break;
        case ARRAY_PT_T:
            for (size_t i = a->length; i > index; --i) {
                a->data.pt[i] = a->data.pt[i - 1];
            }

            a->data.pt[index] = data.pt;

            break;
    }

    ++a->length;

    return AOC_E_OK;
}

enum aoc_error
array_map(struct array *a, void (*function)(union array_data)) {
    if (!(a && a->items && function)) { return AOC_E_ARGUMENT_INVALID; }

    switch (a->type) {
        case ARRAY_LD_T:
            for (size_t i = 0; i < a->length; ++i) {
                (*function)((union array_data) { .ld = a->data.ld[i] });
            }

            break;
        case ARRAY_LU_T:
            for (size_t i = 0; i < a->length; ++i) {
                (*function)((union array_data) { .lu = a->data.lu[i] });
            }

            break;
        case ARRAY_PT_T:
            for (size_t i = 0; i < a->length; ++i) {
                (*function)((union array_data) { .pt = a->data.pt[i] });
            }

            break;
    }

    return AOC_E_OK;
}

enum aoc_error
array_pop(struct array *a, union array_data *data) {
    if (!(a && a->items && a->length)) { return AOC_E_ARGUMENT_INVALID; }
    if (!data) { return AOC_E_ARGUMENT_INVALID; }

    --a->length;

    switch (a->type) {
        case ARRAY_LD_T:
            data->ld = a->data.ld[a->length];
            a->data.ld[a->length] = 0;

            break;
        case ARRAY_LU_T:
            data->lu = a->data.lu[a->length];
            a->data.lu[a->length] = 0;

            break;
        case ARRAY_PT_T:
            data->pt = a->data.pt[a->length];
            a->data.pt[a->length] = NULL;

            break;
    }

    return AOC_E_OK;
}

enum aoc_error
array_push(struct array *a, union array_data data) {
    if (!(a && a->items)) { return AOC_E_ARGUMENT_INVALID; }
    if (a->type == ARRAY_PT_T && !data.pt) { return AOC_E_ARGUMENT_INVALID; }

    if (a->length == a->capacity) {
        if (array_grow(a) != AOC_E_OK) { return AOC_E_ALLOC; }
    }

    switch (a->type) {
        case ARRAY_LD_T:
            a->data.ld[a->length++] = data.ld;

            break;
        case ARRAY_LU_T:
            a->data.lu[a->length++] = data.lu;

            break;
        case ARRAY_PT_T:
            a->data.pt[a->length++] = data.pt;

            break;
    }

    return AOC_E_OK;
}

