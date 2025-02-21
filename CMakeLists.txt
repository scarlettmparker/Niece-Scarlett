cmake_minimum_required(VERSION 3.10)
project(GreekUtils)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -march=native -Wall -Wextra")

# <------------- set the env environment in config ------------->

include(${CMAKE_CURRENT_SOURCE_DIR}/env/load_env.cmake)
function(check_env_file_changed ENV_FILE CHANGED_VAR)
  if(NOT EXISTS ${ENV_FILE})
    set(${CHANGED_VAR} TRUE PARENT_SCOPE)
    return()
  endif()
  file(TIMESTAMP ${ENV_FILE} CURRENT_TIMESTAMP)
  set(TIMESTAMP_FILE "${CMAKE_CURRENT_BINARY_DIR}/env_timestamp.txt")
  if(EXISTS ${TIMESTAMP_FILE})
    file(READ ${TIMESTAMP_FILE} PREVIOUS_TIMESTAMP)
    if(NOT "${PREVIOUS_TIMESTAMP}" STREQUAL "${CURRENT_TIMESTAMP}")
      set(${CHANGED_VAR} TRUE PARENT_SCOPE)
    else()
      set(${CHANGED_VAR} FALSE PARENT_SCOPE)
    endif()
  else()
    set(${CHANGED_VAR} TRUE PARENT_SCOPE)
  endif()
  file(WRITE ${TIMESTAMP_FILE} ${CURRENT_TIMESTAMP})
endfunction()

set(ENV_FILE ${CMAKE_CURRENT_SOURCE_DIR}/env/.env)

# <------------- check for env file changes ------------->

check_env_file_changed(${ENV_FILE} ENV_CHANGED)
if(ENV_CHANGED)
  message("Environment file changed, forcing config.h regeneration")
  file(REMOVE ${CMAKE_CURRENT_BINARY_DIR}/env/config.h)
endif()

configure_file(${ENV_FILE} ${CMAKE_CURRENT_BINARY_DIR}/env_file_dependency COPYONLY)
load_env_file(${ENV_FILE})
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/env/config.h.in ${CMAKE_CURRENT_BINARY_DIR}/env/config.h)
include_directories(${CMAKE_CURRENT_BINARY_DIR}/env ${Boost_INCLUDE_DIRS} ${LIBPQ_INCLUDE_DIRS})

find_package(dpp REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(OPUS REQUIRED opus)


# <------------- add libpq ------------->

include_directories(/usr/local/include)
find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBPQ REQUIRED libpq)
include_directories(${LIBPQ_INCLUDE_DIRS})

# <------------- add libpqxx ------------->

find_library(LIBPQXX_LIB NAMES pqxx PATHS /usr/local/lib)
if (NOT LIBPQXX_LIB)
    message(FATAL_ERROR "libpqxx not found")
endif()

link_directories("lib")
include_directories("lib/include")
add_executable(GreekUtils
  main.cpp
  command.cpp
  postgres.cpp
)

target_link_libraries(GreekUtils 
  dpp::dpp
  ${LIBPQXX_LIB}
  ${LIBPQ_LIBRARIES}
  ${OPUS_LIBRARIES}
)

target_include_directories(GreekUtils PRIVATE 
  ${OPUS_INCLUDE_DIRS}
)