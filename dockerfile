FROM --platform=linux/amd64 node:16-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn global add @nestjs/cli

RUN yarn && yarn cache clean

COPY . .

RUN yarn build

FROM --platform=linux/amd64 node:16-alpine AS production

RUN apk add --no-cache tini

ARG NODE_ENV=production

WORKDIR /usr/src/app

COPY . .

RUN yarn --production && yarn cache clean

COPY --from=development /usr/src/app/dist ./dist

CMD ["node","dist/main.js"]
