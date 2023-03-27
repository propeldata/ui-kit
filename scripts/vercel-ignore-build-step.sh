#!/bin/bash

COMMIT_MESSAGE=$(git log --format=%B -n 1 HEAD)

if [[ "$COMMIT_MESSAGE" == "release" ]]; then
  # Return non-zero exit code to skip the build
  exit 1
else
  # Return zero exit code to continue with the build
  exit 0
fi