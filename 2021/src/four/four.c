#include <ctype.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

#include "array.h"
#include "characters.h"
#include "io.h"
#include "util.h"

#define BOARD_SIZE 25
#define BOARDS_SIZE 16
#define DRAWINGS_SIZE 32
#define NUMBER_WIDTH_MAX 2


struct board {
    uint32_t bitboard;
    struct array *numbers;
};

long int
board_score(struct board *board) {
    if (!(board && board->numbers)) { return -1; }
    if (!(board->numbers->items && board->numbers->length)) { return -1; }

    long int score = 0;

    for (size_t i = 0; i < board->numbers->length; ++i) {
        if (!((board->bitboard >> i) & 1)) {
            score += board->numbers->data.ld[i];
        }
    }

    return score;
}

long int
board_check(struct board *board) {
    if (!(board && board->numbers)) { return -1; }
    if (!(board->numbers->items && board->numbers->length)) { return -1; }

    uint32_t bitboard = board->bitboard;
    uint32_t column = 17318416; // 0b1000010000100001000010000
    uint32_t row = 32505856;    // 0b1111100000000000000000000

    for (size_t i = 0; i < 5; ++i) {
        if (bitboard == (bitboard | (row >> 5 * i))) {
            return board_score(board);
        }

        if (bitboard == (bitboard | (column >> i))) {
            return board_score(board);
        }
    }

    return 0;
}

struct board *
board_create(size_t size) {
    if (!size) { return NULL; }

    struct board *b = calloc(1, sizeof *b);
    if (!b) { return NULL; }

    b->numbers = array_create(size, ARRAY_LD_T);
    if (!b->numbers) {
        free(b);

        return NULL;
    }

    return b;
}

void
board_free(void *p) {
    struct board *b = p;
    if (!b) { return; }

    if (b->numbers) {
        array_destroy(b->numbers, NULL);
    }

    free(b);
}


struct array *
boards_parse(struct array *lines) {
    if (!(lines && lines->items)) { return NULL; }
    if (!lines->length || lines->length % 5) { return NULL; }

    struct array *boards = array_create(BOARDS_SIZE, ARRAY_PT_T);
    if (!boards) { return NULL; }

    enum aoc_error result = AOC_E_OK;

    for (size_t i = 0; i < lines->length; i += 5) {
        struct board *board = board_create(BOARD_SIZE);
        if (!board) {
            return array_destroy(boards, board_free);
        }

        for (size_t j = i; j < i + 5; ++j) {
            struct string *line = lines->data.pt[j];
            union array_data number = { .ld = 0 };

            char *digits = line->value;

            for (size_t k = 0; k < line->length + 1; ++k) {
                char character = line->value[k];

                if (character == ' ') {
                    character = line->value[k] = '\0';
                } else if (isdigit(character)) {
                    if (!*digits) {
                        digits = line->value + k;
                    }
                }

                if (!character && *digits) {
                    result |= string_into_number(digits, &number.ld, 10);
                    result |= array_push(board->numbers, number);
                    if (result != AOC_E_OK) {
                        return array_destroy(boards, board_free);
                    }

                    digits = line->value + k;
                }
            }
        }

        result |= array_push(boards, (union array_data) { .pt = board });
        if (result != AOC_E_OK) {
            return array_destroy(boards, board_free);
        }
    }

    return boards;
}

struct array *
drawings_parse(struct string *line) {
    if (!(line && line->length)) { return NULL; }
    if (line->empty) { return NULL; }

    struct array *drawings = array_create(DRAWINGS_SIZE, ARRAY_LD_T);
    if (!drawings) { return NULL; }

    char *digits = line->value;
    union array_data number = { .ld = 0 };

    for (size_t i = 0; i <= line->length; ++i) {
        char character = line->value[i];
        if (character == ',') {
            character = line->value[i] = '\0';
        }

        if (!character) {
            enum aoc_error result = AOC_E_OK;

            result |= string_into_number(digits, &number.ld, 10);
            result |= array_push(drawings, number);
            if (result != AOC_E_OK) {
                return array_destroy(drawings, NULL);
            }

            digits = line->value + i + 1;
        }
    }

    return drawings;
}


enum aoc_error
bingo_score(struct array *lines) {
    if (!(lines && lines->items)) { return AOC_E_ARGUMENT_INVALID; }
    if (!lines->length) { return AOC_E_ARGUMENT_INVALID; }

    struct string *drawings_line = lines->data.pt[0];
    if (array_delete(lines, 0) != AOC_E_OK) { return AOC_E_UNKNOWN; }

    enum aoc_error result = AOC_E_OK;

    struct array *drawings = drawings_parse(drawings_line);
    if (!drawings) {
        result = AOC_E_UNKNOWN;

        goto exit_drawings;
    }

    struct array *boards = boards_parse(lines);
    if (!boards) {
        result = AOC_E_UNKNOWN;

        goto exit_boards;
    }

    for (size_t i = 0; i < drawings->length; ++i) {
        for (size_t j = 0; j < boards->length; ++j) {
            struct board *board = boards->data.pt[j];
            for (size_t k = 0; k < board->numbers->length; ++k) {
                if (board->numbers->data.ld[k] == drawings->data.ld[i]) {
                    board->bitboard ^= 1 << k;

                    break;
                }
            }

            long int score = board_check(board);
            if (score > 0) {
                long int number_called = drawings->data.ld[i];

                puts("[.] winner:");
                printf("[.]  d[%02zd]: %ld\n", i, number_called);

                for (size_t l = 0; l < board->numbers->length; l += 5) {
                    if (l) {
                        printf("[.]        ");
                    } else {
                        printf("[.]  b[%02zd]:", j);
                    }

                    for (size_t m = l; m < l + 5; ++m) {
                        printf(" %2ld", board->numbers->data.ld[m]);
                    }

                    puts("");
                }

                printf("[.]  score: %ld * %ld = %ld\n",
                    score, number_called, score * number_called);

                goto exit;
            }
        }
    }

exit:
    array_destroy(boards, board_free);
exit_boards:
    array_destroy(drawings, NULL);
exit_drawings:
    string_destroy(drawings_line);

    return result;
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

    enum aoc_error result = bingo_score(lines);

    array_destroy(lines, string_free);

    return error_handle(result);
}

