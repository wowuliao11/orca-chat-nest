FROM node:16.18.1-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn global add @nestjs/cli

RUN yarn && yarn cache clean

COPY . .

RUN yarn build

FROM node:16.18.1-alpine AS production

RUN apk add --no-cache tini

ARG NODE_ENV=production

WORKDIR /usr/src/app

COPY . .

COPY .env.production .env

RUN yarn --production && yarn cache clean

COPY --from=development /usr/src/app/dist ./dist

CMD ["node","dist/main.js"]
