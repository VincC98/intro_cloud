#!/bin/bash
docker stop frontend
docker rm frontend

cd /home/user/sf_LINFO2145-2023-2024/project/src/front-end

docker build -t scapp-frontend . 

cd /home/user/sf_LINFO2145-2023-2024

docker run -d -p 3000:3000 --name frontend -e PUBLIC_AUTH_SERVICE_URL=http://192.168.56.102:3001 scapp-frontend