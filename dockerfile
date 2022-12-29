FROM node:lts-alpine AS development

WORKDIR /usr/src/app

COPY . .

RUN yarn cache clean

RUN yarn global add @nestjs/cli --network-timeout 1000000

RUN yarn && yarn cache clean --network-timeout 1000000

RUN yarn build

FROM node:lts-alpine AS production

RUN apk add --no-cache tini

ARG NODE_ENV=production

WORKDIR /usr/src/app

COPY . .

COPY .env.production .env

RUN yarn cache clean

RUN yarn --production --network-timeout 1000000 && yarn cache clean 

COPY --from=development /usr/src/app/dist ./dist

CMD ["node","dist/main.js"]
