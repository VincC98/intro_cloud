#!/bin/bash

#Run the containers
docker run -d -p 3002:5984 --name users-db kv-storage-system
docker run -d -p 3003:5984 --name carts-db kv-storage-system
docker run -d -p 3006:5984 --name checkouts-db kv-storage-system
docker run -d -p 3008:5984 --name logs-db kv-storage-system
docker run -d -p 3011:5984 --name products-db kv-storage-system
docker run -d -p 3013:5984 --name reco-db kv-storage-system

docker run -d -p 3001:80 --name auth-service --link users-db scapp-auth
docker run -d -p 3004:80 --name cart-service --link carts-db scapp-carts
docker run -d -p 3005:80 --name checkout-service --link checkouts-db scapp-checkouts
docker run -d -p 3007:80 --name logs-service --link logs-db scapp-logs
docker run -d -p 3009:80 --name products-service --link products-db scapp-products
docker run -d -p 3012:80 --name recommendations-service --link logs-db --link reco-db scapp-recommendations

docker run -d -p 3000:3000 --name frontend scapp-frontend
docker run -d -p 3010:80 --name gateway-service scapp-gateway
