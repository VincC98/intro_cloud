# MAINTAINER Raziel Carvajal-Gomez <raziel.carvajal-gomez@uclouvain.be>
FROM node:20-alpine

WORKDIR /usr/src/recommendations
RUN apk update && apk add curl

RUN npm install debug
# let NPM packages be called anywhere within the container
ENV PATH /usr/src/cart-service/node_modules/.bin:${PATH}
ADD package.json .
RUN npm install

ADD gulpfile.js .
ADD src src
ADD views views
ADD func_to_string.js .
ADD wait-for-couchdb.sh .
ADD dataset ./dataset
ADD fill_db.sh .
# header for loggining messages
ENV DEBUG reco-d

# name of container running CouchDB
ENV DB_HOST reco-db
# database name
ENV DB_NAME reco
# authentication information to CRUD (create/remove/update/delete) objects in our DB
ENV ADMIN_NAME admin
ENV ADMIN_PASSW admin
ENV DB_URL http://${ADMIN_NAME}:${ADMIN_PASSW}@${DB_HOST}:5984/${DB_NAME}
#for the creation of the view
ENV DB_URL_LOG http://admin:admin@logs-db:5984/logs 
#for the creation of the view
CMD source wait-for-couchdb.sh

