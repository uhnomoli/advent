add_executable(five ${CMAKE_CURRENT_SOURCE_DIR}/five.c)
set_target_properties(
    five
    PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/bin)
target_link_libraries(five array characters io m util)

