add_library(util SHARED util.c)
target_compile_options(
    util PUBLIC
        -Waggregate-return
        -Wall
        -Wextra
        -Wfloat-equal
        -Winline
        -Wpedantic
        -Wstack-usage=1024
        -Wwrite-strings)
target_include_directories(util PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

