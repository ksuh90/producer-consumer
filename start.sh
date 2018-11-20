#!/bin/bash

# Install root level node packages
npm install

# Run containers
docker-compose up --scale producer=3

# Run containers with sync for developing (only one producer)
# docker-sync-stack start

exit 0
