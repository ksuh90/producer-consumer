#!/bin/bash

# Install root level node packages
npm install

# Run containers
docker-compose up --scale producer=3

exit 0
