#!/bin/bash
docker stop gateway-service
docker rm gateway-service

cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/gateway

docker build -t scapp-gateway . 

cd /home/user/sf_LINFO2145-2023-2024

docker run -d -p 3010:80 --name gateway-service scapp-gateway