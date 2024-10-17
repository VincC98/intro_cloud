#!/bin/bash
docker stop cart-service
docker rm cart-service

cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/carts

docker build -t scapp-carts . 

cd /home/user/sf_LINFO2145-2023-2024

docker run -d -p 3004:80 --name cart-service --link carts-db scapp-carts