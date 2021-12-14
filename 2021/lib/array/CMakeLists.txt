add_library(array SHARED array.c)
target_compile_options(
    array PUBLIC
        -Waggregate-return
        -Wall
        -Wextra
        -Wfloat-equal
        -Winline
        -Wpedantic
        -Wstack-usage=1024
        -Wwrite-strings)
target_include_directories(array PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(array util)

