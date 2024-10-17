# this image relies on the nodejs image
FROM node:20-alpine
# set working directory
WORKDIR /usr/src/products-service
# we need CURL to verify that the key-value storage is running (see boot-in-order.sh)
RUN apk update && apk add curl

# let NPM packages be called anywhere within the container
ENV PATH /usr/src/products-service/node_modules/.bin:${PATH}
ADD package.json .
COPY package.json ./
COPY . ./
RUN npm install
RUN npm install @azure/storage-blob
RUN npm install @azure/identity
RUN npm install axios
# source files of the authentication service
ADD gulpfile.js .
ADD src src
ADD boot-in-order.sh .
# initial products list
ADD jsons jsons
ADD views views
ADD func_to_string.js .
ADD wait-for-couchdb.sh .

# header for loggining messages
ENV DEBUG products-d
# non empty string use perisitence (with CouchDB)
ENV WITH_PERSISTENT_DATA Y

# name of container running CouchDB
ENV DB_HOST products-db
# database name
ENV DB_NAME products
# authentication information to CRUD (create/remove/update/delete) objects in our DB
ENV ADMIN_NAME admin
ENV ADMIN_PASSW admin
ENV DB_URL http://${ADMIN_NAME}:${ADMIN_PASSW}@${DB_HOST}:5984/${DB_NAME}
ENV ACCOUNT_NAME "modified_for_privacy"
ENV ACCOUNT_KEY "modified_for_privacy"

# we now use an script to deploy the authentication service
CMD source wait-for-couchdb.sh

