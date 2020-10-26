FROM node:12-alpine

WORKDIR /proxy

COPY package.json .

RUN npm install

ENTRYPOINT ["/usr/local/bin/node", "index.js"]