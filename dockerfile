FROM node:lts-alpine AS development

WORKDIR /usr/src/app

COPY . .

RUN yarn config set registry "https://registry.npmjs.org/"

RUN yarn global add @nestjs/cli --network-timeout 100000

RUN yarn && yarn cache clean --network-timeout 100000

RUN yarn build

FROM node:lts-alpine AS production

RUN apk add --no-cache tini

ARG NODE_ENV=production

WORKDIR /usr/src/app

COPY . .

COPY .env.production .env

RUN yarn config set registry "https://registry.npmjs.org/"

RUN yarn --production && yarn cache clean --network-timeout 100000

COPY --from=development /usr/src/app/dist ./dist

CMD ["node","dist/main.js"]
