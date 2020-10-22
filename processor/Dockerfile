FROM node:8

WORKDIR /processor

COPY package.json .

RUN npm install

ENTRYPOINT ["/usr/local/bin/node", "src/index.js"]