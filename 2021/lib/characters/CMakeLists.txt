add_library(characters SHARED characters.c)
target_compile_options(
    characters PUBLIC
        -Waggregate-return
        -Wall
        -Wextra
        -Wfloat-equal
        -Winline
        -Wpedantic
        -Wstack-usage=1024
        -Wwrite-strings)
target_include_directories(characters PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(characters util)

