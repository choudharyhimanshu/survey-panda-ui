# base image
FROM node:latest

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

RUN npm install

# start app
CMD ["npm", "start"]
