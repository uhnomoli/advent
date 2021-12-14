add_library(io SHARED io.c)
target_compile_options(
    io PUBLIC
        -Waggregate-return
        -Wall
        -Wextra
        -Wfloat-equal
        -Winline
        -Wpedantic
        -Wstack-usage=1024
        -Wwrite-strings)
target_include_directories(io PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(io array characters util)

