#!/bin/bash
docker stop reco-db
docker rm reco-db
docker stop recommendations-service
docker rm recommendations-service

cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/recommendations

docker build -t scapp-recommendations . 

cd /home/user/sf_LINFO2145-2023-2024

docker run -d -p 3013:5984 --name reco-db kv-storage-system
docker run -d -p 3012:80 --name recommendations-service --link logs-db --link reco-db scapp-recommendations
