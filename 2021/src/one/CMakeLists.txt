add_executable(one ${CMAKE_CURRENT_SOURCE_DIR}/one.c)
set_target_properties(
    one
    PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/bin)
target_link_libraries(one array characters io util)

