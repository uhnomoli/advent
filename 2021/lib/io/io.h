#ifndef IO_H
#define IO_H

#include <stdbool.h>

#include "array.h"


struct array *
file_into_lines(const char *path, bool with_empty);

#endif

