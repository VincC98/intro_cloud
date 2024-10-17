#!/bin/bash
docker stop checkout-service
docker rm checkout-service

cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/checkout

docker build -t scapp-checkouts . 

cd /home/user/sf_LINFO2145-2023-2024

docker run -d -p 3005:80 --name checkout-service --link checkouts-db scapp-checkouts