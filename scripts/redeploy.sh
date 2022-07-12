#!/bin/bash

# This script is meant to run on the ec2 directly.
# Invoked when someone pushes commits.

git pull origin master

docker compose -f ./scripts/docker-compose.yml stop server
docker compose -f ./scripts/docker-compose.yml up --build -d server
