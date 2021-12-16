#ifndef ARRAY_H
#define ARRAY_H

#include <stddef.h>

#include "util.h"


struct array {
    size_t capacity;
    size_t length;

    void **items;
};


void
array_clear(struct array *a, void (*function)(void *));

struct array *
array_copy(struct array *a);

struct array *
array_create(size_t capacity);

enum aoc_error
array_delete(struct array *a, size_t index);

struct array *
array_destroy(struct array *a, void (*function)(void *));

enum aoc_error
array_insert(struct array *a, size_t index, void *item);

enum aoc_error
array_map(struct array *a, void (*function)(void *));

void *
array_pop(struct array *a);

enum aoc_error
array_push(struct array *a, void *item);

#endif

