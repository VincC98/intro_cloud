# this image relies on the nodejs image
FROM node:20-alpine
# set working directory
WORKDIR /usr/src/auth-service
# we need CURL to verify that the key-value storage is running (see boot-in-order.sh)
RUN apk update && apk add curl

# let NPM packages be called anywhere within the container
ENV PATH /usr/src/auth-service/node_modules/.bin:${PATH}
ADD package.json .
RUN npm install
RUN npm install axios
RUN npm install jsonwebtoken
RUN npm install cookie-parser
RUN npm install cors
# source files of the authentication service
ADD gulpfile.js .
ADD src src
ADD boot-in-order.sh .
# header for loggining messages
ENV DEBUG gateway-d
# string to create tokens 
ENV TOKEN_SECRET superSecretString

# we now use an script to deploy the authentication service
CMD source boot-in-order.sh

