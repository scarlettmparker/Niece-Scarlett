cmake_minimum_required(VERSION 3.10)
project(GreekUtils)
include(FetchContent)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -march=native -Wall -Wextra")

# ───────────────────────────────────────────────────────────────
# Load environment variables
# ───────────────────────────────────────────────────────────────
include(${CMAKE_CURRENT_SOURCE_DIR}/env/load_env.cmake)

set(ENV_FILE ${CMAKE_CURRENT_SOURCE_DIR}/env/.env)
check_env_file_changed(${ENV_FILE} ENV_CHANGED)
if(ENV_CHANGED)
  message("Environment file changed, forcing config.h regeneration")
  file(REMOVE ${CMAKE_CURRENT_BINARY_DIR}/env/config.h)
endif()

configure_file(${ENV_FILE} ${CMAKE_CURRENT_BINARY_DIR}/env_file_dependency COPYONLY)
load_env_file(${ENV_FILE})
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/env/config.h.in ${CMAKE_CURRENT_BINARY_DIR}/env/config.h)
include_directories(
  ${CMAKE_CURRENT_BINARY_DIR}/env
  ${Boost_INCLUDE_DIRS}
  ${LIBPQ_INCLUDE_DIRS}
)

# ───────────────────────────────────────────────────────────────
# External libraries
# ───────────────────────────────────────────────────────────────

# dpp
FetchContent_Declare(
  dpp
  GIT_REPOSITORY https://github.com/brainboxdotcc/DPP.git
  GIT_TAG        master
)
FetchContent_MakeAvailable(dpp)

# libpq
include_directories(/usr/local/include)
find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBPQ REQUIRED libpq)
include_directories(${LIBPQ_INCLUDE_DIRS})

# libpqxx
find_library(LIBPQXX_LIB NAMES pqxx PATHS /usr/local/lib)
if (NOT LIBPQXX_LIB)
    message(FATAL_ERROR "libpqxx not found")
endif()

link_directories("lib")
include_directories("lib/include")

# ───────────────────────────────────────────────────────────────
# Build command plugins as shared libraries
# ───────────────────────────────────────────────────────────────
file(GLOB COMMAND_SOURCES CONFIGURE_DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/command/*.cpp")

foreach(SOURCE_FILE ${COMMAND_SOURCES})
  get_filename_component(LIB_NAME ${SOURCE_FILE} NAME_WE)
  add_library(
    ${LIB_NAME} SHARED ${SOURCE_FILE}
    # Add any dependencies needed by all commands here
  )
  set_target_properties(
    ${LIB_NAME}
    PROPERTIES OUTPUT_NAME ${LIB_NAME}
    LIBRARY_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/command/plugins"
  )
  target_link_libraries(
    ${LIB_NAME}
    dpp
    ${LIBPQXX_LIB}
    ${LIBPQ_LIBRARIES}
    pthread
    dl
    ${OPUS_LIBRARIES}
  )
endforeach()

# ───────────────────────────────────────────────────────────────
# Main executable
# ───────────────────────────────────────────────────────────────
add_executable(GreekUtils
  main.cpp
  command.cpp
  postgres.cpp
  utils.cpp
  api/annotation.cpp
  factory/embed_factory.cpp
  factory/direct_message_factory.cpp
  factory/pbp_embed_factory.cpp
  factory/ping_factory.cpp
  registry/command_registry.cpp
)

target_link_libraries(GreekUtils
  dpp
  ${LIBPQXX_LIB}
  ${LIBPQ_LIBRARIES}
  pthread
  dl
  ${OPUS_LIBRARIES}
)

set_target_properties(GreekUtils PROPERTIES LINK_FLAGS "-rdynamic")
set_target_properties(GreekUtils PROPERTIES ENABLE_EXPORTS ON)

target_include_directories(GreekUtils PRIVATE 
  ${OPUS_INCLUDE_DIRS}
)