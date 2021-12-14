add_executable(two ${CMAKE_CURRENT_SOURCE_DIR}/two.c)
set_target_properties(
    two
    PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/bin)
target_link_libraries(two array characters io util)

