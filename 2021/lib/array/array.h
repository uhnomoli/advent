#ifndef ARRAY_H
#define ARRAY_H

#include <stddef.h>

#include "util.h"

union array_data {
    long int ld;
    unsigned long int lu;
    void *pt;
};

enum array_type {
    ARRAY_LD_T,
    ARRAY_LU_T,
    ARRAY_PT_T
};

struct array {
    size_t capacity;
    void *items;
    size_t length;
    enum array_type type;

    union {
        long int *ld;
        unsigned long int *lu;
        void **pt;
    } data;
};


void
array_clear(struct array *a, void (*function)(void *));

struct array *
array_copy(struct array *a);

struct array *
array_create(size_t capacity, enum array_type type);

enum aoc_error
array_delete(struct array *a, size_t index);

struct array *
array_destroy(struct array *a, void (*function)(void *));

enum aoc_error
array_insert(struct array *a, size_t index, union array_data data);

enum aoc_error
array_map(struct array *a, void (*function)(union array_data));

enum aoc_error
array_pop(struct array *a, union array_data *data);

enum aoc_error
array_push(struct array *a, union array_data data);

#endif

