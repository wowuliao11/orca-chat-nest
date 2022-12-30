FROM node:16.19-alpine AS development

WORKDIR /usr/src/app

COPY . .

RUN yarn cache clean

RUN yarn

RUN yarn build

FROM node:16.19-alpine AS production

# RUN apk add --no-cache tini

ARG NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

COPY .yarn .yarn

COPY .yarnrc.yml ./

COPY .pnp.* ./

COPY .env.production .env

RUN  yarn workspaces focus --production 

COPY --from=development /usr/src/app/dist ./dist

CMD ["yarn","node","dist/main.js"]
