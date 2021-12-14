add_executable(three ${CMAKE_CURRENT_SOURCE_DIR}/three.c)
set_target_properties(
    three
    PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/bin)
target_link_libraries(three array characters io util)

