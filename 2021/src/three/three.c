#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "array.h"
#include "characters.h"
#include "io.h"
#include "util.h"


unsigned int *
bit_frequency(struct array *numbers, size_t number_width) {
    if (!(numbers && numbers->items && numbers->length)) { return NULL; }
    if (!number_width) { return NULL; }

    unsigned int *bits = calloc(number_width, sizeof *bits);
    if (!bits) { return NULL; }

    for (size_t i = 0; i < numbers->length; ++i) {
        struct string *number = numbers->items[i];
        if (number->length != number_width) {
            free(bits);

            return NULL;
        }

        for (size_t j = 0; j < number->length; ++j) {
            if (number->value[j] == '1') {
                ++bits[j];
            }
        }
    }

    return bits;
}

enum aoc_error
numbers_filter(struct array *numbers, bool most) {
    if (!(numbers && numbers->items)) { return AOC_E_ARGUMENT_INVALID; }
    if (!numbers->length) { return AOC_E_ARGUMENT_INVALID; }

    size_t number_width = ((struct string *) numbers->items[0])->length;
    enum aoc_error result = AOC_E_OK;

    unsigned int *bits = bit_frequency(numbers, number_width);
    if (!bits) { return AOC_E_ARGUMENT_INVALID; }

    for (size_t i = 0; i < number_width; ++i) {
        char bit = '0';

        if (most) {
            if (bits[i] >= numbers->length - bits[i]) {
                bit = '1';
            }
        } else {
            if (bits[i] < numbers->length - bits[i]) {
                bit = '1';
            }
        }

        for (size_t j = 0; j < numbers->length; ++j) {
            struct string *number = numbers->items[j];
            if (number->length != number_width) {
                result = AOC_E_ARGUMENT_INVALID;

                goto exit;
            }

            if (number->value[i] != bit) {
                result = array_delete(numbers, j--);
                if (result != AOC_E_OK) { goto exit; }
            }
        }

        if (numbers->length == 1) { break; }

        free(bits);

        bits = bit_frequency(numbers, number_width);
        if (!bits) { return AOC_E_ALLOC; }
    }

exit:
    free(bits);

    return result;
}


enum aoc_error
life_support(struct array *lines) {
    if (!(lines && lines->items)) { return AOC_E_ARGUMENT_INVALID; }
    if (!lines->length) { return AOC_E_ARGUMENT_INVALID; }

    enum aoc_error result = AOC_E_OK;

    struct array *co2 = array_copy(lines);
    struct array *o2 = array_copy(lines);
    if (!(co2 && o2)) { 
        result = AOC_E_ALLOC;

        goto exit;
    }

    result = numbers_filter(co2, false);
    if (result != AOC_E_OK) { goto exit; }
    long int co2_rating = 0;
    result = string_into_number(
        ((struct string *) co2->items[0])->value, &co2_rating, 2);
    if (result != AOC_E_OK) { goto exit; }

    result = numbers_filter(o2, true);
    if (result != AOC_E_OK) { goto exit; }
    long int o2_rating = 0;
    result = string_into_number(
        ((struct string *) o2->items[0])->value, &o2_rating, 2);
    if (result != AOC_E_OK) { goto exit; }

    printf("[.] life support rating (co2, o2): %ld (%ld, %ld)\n",
        co2_rating * o2_rating, co2_rating, o2_rating);

exit:
    array_destroy(o2, NULL);
    array_destroy(co2, NULL);

    return result;
}

enum aoc_error
power_consumption(struct array *numbers) {
    if (!(numbers && numbers->items)) { return AOC_E_ARGUMENT_INVALID; }
    if (!numbers->length) { return AOC_E_ARGUMENT_INVALID; }

    size_t number_width = ((struct string *) numbers->items[0])->length;

    unsigned int *bits = bit_frequency(numbers, number_width);
    if (!bits) { return AOC_E_ARGUMENT_INVALID; }

    unsigned int rate_epsilon = 0;
    unsigned int rate_gamma = 0;

    for (size_t i = 0; i < number_width; ++i) {
        unsigned int value = 1 << (number_width - 1 - i);

        if (bits[i] > numbers->length - bits[i]) {
            rate_gamma += value;
        } else {
            rate_epsilon += value;
        }
    }

    printf("[.] power consumption (epsilon, gamma): %u (%u, %u)\n",
        rate_epsilon * rate_gamma, rate_epsilon, rate_gamma);

    free(bits);

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
    result = power_consumption(lines);
    if (result != AOC_E_OK) { goto exit; }

    result = life_support(lines);

exit:
    array_destroy(lines, string_free);

    return error_handle(result);
}

