#!/bin/bash
docker stop logs-service
docker rm logs-service

cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/logs

docker build -t scapp-logs . 

cd /home/user/sf_LINFO2145-2023-2024

docker run -d -p 3007:80 --name logs-service --link logs-db scapp-logs