#ifndef CHARACTERS_H
#define CHARACTERS_H

#include <stdbool.h>
#include <stddef.h>

#include "util.h"


struct string {
    size_t capacity;
    bool empty;
    size_t length;

    char *value;
};


struct string *
string_create(size_t capacity);

struct string *
string_destroy(struct string *s);

void
string_free(void *p);

enum aoc_error
string_push(struct string *s, char c);


enum aoc_error
string_into_number(char *string, long int *number, int base);

#endif

