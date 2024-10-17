#!/bin/bash

#Stop the containers
docker stop products-db
docker rm products-db
docker stop products-service
docker rm products-service

#Build the images
cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/products
docker build -t scapp-products .

cd /home/user/sf_LINFO2145-2023-2024
#Run the products
docker run -d -p 3011:5984 --name products-db kv-storage-system
docker run -d -p 3009:80 --name products-service --link products-db scapp-products