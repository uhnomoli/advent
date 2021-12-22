add_executable(four ${CMAKE_CURRENT_SOURCE_DIR}/four.c)
set_target_properties(
    four
    PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/bin)
target_link_libraries(four array characters io util)

