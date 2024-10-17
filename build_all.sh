#!/bin/bash

#build auth
cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/users

docker build -t scapp-auth . 

#build carts service
cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/carts

docker build -t scapp-carts . 

#build checkout service
cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/checkout

docker build -t scapp-checkouts . 

#build product service
cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/products

docker build -t scapp-products .

#build log service
cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/logs

docker build -t scapp-logs . 
#build couchDB
cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/storage

docker build -t kv-storage-system .

#build gateway
cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/gateway

docker build -t scapp-gateway . 

#build recommendations
cd /home/user/sf_LINFO2145-2023-2024/project/src/back-end/recommendations

docker build -t scapp-recommendations . 

#build frontend
cd /home/user/sf_LINFO2145-2023-2024/project/src/front-end

docker build -t scapp-frontend . 

