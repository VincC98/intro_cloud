#!/bin/bash

#Stop all running Docker containers
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

