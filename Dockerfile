FROM node:18-alpine

WORKDIR /usr/app

RUN apk update && apk add socat git

RUN chown -R node:node /usr/app

COPY package*.json .

RUN npm install

USER node

COPY . .

EXPOSE 3333

CMD npm run start:dev